import type { JungleState } from './JungleTracker';
import type { GameData } from './JungleDataCollector';

export interface Recommendation {
  priority: number;
  action: string;
  reason: string;
  confidence: number;
  eta?: number;
  category: 'camp' | 'gank' | 'objective' | 'recall' | 'invade';
}

export interface DecisionContext {
  gameTime: number;
  playerLevel: number;
  currentGold: number;
  playerPosition: { x: number; y: number };
  healthPercent: number;
  manaPercent: number;
}

export class JungleDecisionEngine {
  private lastRecommendations: Recommendation[] = [];

  getRecommendations(jungleState: JungleState, gameData?: GameData): Recommendation[] {
    const context = this.buildContext(gameData);
    const recommendations: Recommendation[] = [];

    // Generate different types of recommendations
    recommendations.push(...this.getCampRecommendations(jungleState, context));
    recommendations.push(...this.getGankRecommendations(jungleState, context));
    recommendations.push(...this.getObjectiveRecommendations(jungleState, context));
    recommendations.push(...this.getRecallRecommendations(jungleState, context));
    recommendations.push(...this.getInvadeRecommendations(jungleState, context));

    // Sort by priority and return top 3
    const topRecommendations = recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);

    this.lastRecommendations = topRecommendations;
    return topRecommendations;
  }

  // Decision analysis methods
  shouldGank(lane: string, jungleState: JungleState, context: DecisionContext) {
    const lanePriority = jungleState.lanePriorities.find(lp => lp.lane === lane);
    if (!lanePriority) {
      return { decision: false, confidence: 0, reasons: ['Lane data unavailable'] };
    }

    const reasons: string[] = [];
    let confidence = 0.4; // Base confidence

    if (lanePriority.gankability > 0.7) {
      confidence += 0.3;
      reasons.push('High gank potential');
    }

    if (lanePriority.pushFactor > 0.6) {
      confidence += 0.2;
      reasons.push('Lane pushed favorably');
    }

    if (context.healthPercent > 0.6) {
      confidence += 0.1;
      reasons.push('Good health for gank');
    }

    const shouldGank = confidence > 0.65;

    return {
      decision: shouldGank,
      confidence: Math.min(confidence, 1.0),
      reasons
    };
  }

  shouldRecall(jungleState: JungleState, context: DecisionContext) {
    const reasons: string[] = [];
    let confidence = 0.3;

    if (context.healthPercent < 0.4) {
      confidence += 0.4;
      reasons.push('Low health');
    }

    if (context.currentGold > 1000) {
      confidence += 0.3;
      reasons.push('Gold for items');
    }

    if (this.lastRecommendations.filter(r => r.priority > 0.8).length === 0) {
      confidence += 0.2;
      reasons.push('No high-priority actions');
    }

    return {
      decision: confidence > 0.7,
      confidence: Math.min(confidence, 1.0),
      reasons
    };
  }

  // Private recommendation generators
  private getCampRecommendations(jungleState: JungleState, context: DecisionContext): Recommendation[] {
    const availableCamps = jungleState.ownCamps
      .filter(camp => camp.isAlive || (camp.respawnTime && camp.respawnTime <= context.gameTime + 30))
      .sort((a, b) => b.efficiency - a.efficiency);

    if (availableCamps.length === 0) return [];

    const bestCamp = availableCamps[0];
    
    return [{
      priority: 0.7 + bestCamp.efficiency * 0.2,
      action: `Clear ${bestCamp.name}`,
      reason: `High efficiency camp (${Math.round(bestCamp.efficiency * 100)}%)`,
      confidence: 0.8,
      eta: bestCamp.nextOptimal,
      category: 'camp'
    }];
  }

  private getGankRecommendations(jungleState: JungleState, context: DecisionContext): Recommendation[] {
    const recommendations: Recommendation[] = [];

    jungleState.lanePriorities.forEach(lane => {
      const gankDecision = this.shouldGank(lane.lane, jungleState, context);
      
      if (gankDecision.decision) {
        recommendations.push({
          priority: 0.8 + lane.priority * 0.2,
          action: `Gank ${lane.lane} lane`,
          reason: gankDecision.reasons.join(', '),
          confidence: gankDecision.confidence,
          category: 'gank'
        });
      }
    });

    return recommendations;
  }

  private getObjectiveRecommendations(jungleState: JungleState, context: DecisionContext): Recommendation[] {
    const recommendations: Recommendation[] = [];

    jungleState.objectiveTimers.forEach(objective => {
      if (objective.respawnTime <= context.gameTime + 30 && objective.teamCanTake) {
        recommendations.push({
          priority: 0.9 + objective.priority * 0.1,
          action: `Secure ${objective.name}`,
          reason: 'Objective window open',
          confidence: 0.8,
          eta: objective.respawnTime,
          category: 'objective'
        });
      }
    });

    return recommendations;
  }

  private getRecallRecommendations(jungleState: JungleState, context: DecisionContext): Recommendation[] {
    const recallDecision = this.shouldRecall(jungleState, context);
    
    if (recallDecision.decision) {
      return [{
        priority: 0.6,
        action: 'Recall to base',
        reason: recallDecision.reasons.join(', '),
        confidence: recallDecision.confidence,
        category: 'recall'
      }];
    }

    return [];
  }

  private getInvadeRecommendations(jungleState: JungleState, context: DecisionContext): Recommendation[] {
    const highConfidenceEnemyCamps = jungleState.enemyCampEstimation
      .filter(camp => camp.confidence > 0.7)
      .sort((a, b) => b.confidence - a.confidence);

    if (highConfidenceEnemyCamps.length > 0) {
      const targetCamp = highConfidenceEnemyCamps[0];
      
      return [{
        priority: 0.75,
        action: `Invade ${targetCamp.name}`,
        reason: `Enemy position known (${Math.round(targetCamp.confidence * 100)}% confidence)`,
        confidence: targetCamp.confidence,
        category: 'invade'
      }];
    }

    return [];
  }

  private buildContext(gameData?: GameData): DecisionContext {
    if (!gameData) {
      return {
        gameTime: 0,
        playerLevel: 1,
        currentGold: 500,
        playerPosition: { x: 0, y: 0 },
        healthPercent: 1.0,
        manaPercent: 1.0
      };
    }

    return {
      gameTime: gameData.gameTime,
      playerLevel: gameData.level,
      currentGold: gameData.currentGold,
      playerPosition: gameData.position,
      healthPercent: 0.8, // Would need actual health data from Live Client
      manaPercent: 0.7    // Would need actual mana data from Live Client
    };
  }
}
