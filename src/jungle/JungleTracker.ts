import type { GameData, CampData } from './JungleDataCollector';
import type { ObjectiveTimer, Lane } from '../shared/types';

export interface TrackedCamp extends CampData {
  efficiency: number;
  nextOptimal: number;
}

export interface EnemyCampEstimate {
  name: string;
  position: { x: number; y: number };
  lastSeenAt: number;
  estimatedRespawn: number;
  confidence: number;
}

export interface ScuttleState {
  topRiver: { alive: boolean; respawnTime?: number; priority: number };
  bottomRiver: { alive: boolean; respawnTime?: number; priority: number };
}

export interface LanePriority {
  lane: Lane;
  pushFactor: number;
  gankability: number; 
  priority: number;
}

export interface JungleState {
  ownCamps: TrackedCamp[];
  enemyCampEstimation: EnemyCampEstimate[];
  scuttleTimers: ScuttleState;
  objectiveTimers: ObjectiveTimer[];
  lanePriorities: LanePriority[];
  lastUpdated: number;
}

export class JungleTracker {
  private currentState: JungleState;
  private campHistory = new Map<string, number[]>();

  constructor() {
    this.currentState = {
      ownCamps: [],
      enemyCampEstimation: [],
      scuttleTimers: {
        topRiver: { alive: true, priority: 0.5 },
        bottomRiver: { alive: true, priority: 0.5 }
      },
      objectiveTimers: [],
      lanePriorities: [],
      lastUpdated: Date.now()
    };
  }

  updateState(gameData: GameData): JungleState {
    this.updateOwnCamps(gameData);
    this.updateEnemyCampEstimation(gameData);
    this.updateScuttlePriority(gameData);
    this.updateObjectiveTimers(gameData);
    this.updateLanePriorities(gameData);
    
    this.currentState.lastUpdated = Date.now();
    return this.currentState;
  }

  getCurrentState(): JungleState {
    return { ...this.currentState };
  }

  private updateOwnCamps(gameData: GameData) {
    this.currentState.ownCamps = gameData.camps.map(camp => ({
      ...camp,
      efficiency: this.calculateCampEfficiency(camp, gameData.gameTime),
      nextOptimal: this.calculateOptimalClearTime(camp, gameData.gameTime)
    }));
  }

  private updateEnemyCampEstimation(gameData: GameData) {
    // Find enemy jungler
    const enemyJungler = gameData.players.find(player =>
      player.team !== this.getPlayerTeam(gameData.playerName, gameData.players) &&
      this.isJunglerRole(player)
    );

    if (enemyJungler?.position) {
      // Enemy jungle camp positions (red side)
      const enemyCamps = [
        { name: 'Enemy Blue', position: { x: 10900, y: 6700 } },
        { name: 'Enemy Red', position: { x: 7600, y: 10500 } },
        { name: 'Enemy Gromp', position: { x: 12600, y: 6200 } },
        { name: 'Enemy Krugs', position: { x: 6200, y: 11900 } }
      ];

      this.currentState.enemyCampEstimation = enemyCamps.map(camp => ({
        name: camp.name,
        position: camp.position,
        lastSeenAt: gameData.gameTime - 30,
        estimatedRespawn: gameData.gameTime + 60,
        confidence: this.calculateEstimationConfidence(enemyJungler.position!, camp.position)
      }));
    }
  }

  private updateScuttlePriority(gameData: GameData) {
    const nextScuttleSpawn = this.getNextScuttleSpawn(gameData.gameTime);
    
    this.currentState.scuttleTimers = {
      topRiver: {
        alive: gameData.gameTime >= nextScuttleSpawn - 10,
        respawnTime: nextScuttleSpawn,
        priority: this.calculateScuttlePriority('top', gameData)
      },
      bottomRiver: {
        alive: gameData.gameTime >= nextScuttleSpawn - 10,
        respawnTime: nextScuttleSpawn,
        priority: this.calculateScuttlePriority('bottom', gameData)
      }
    };
  }

  private updateObjectiveTimers(gameData: GameData) {
    this.currentState.objectiveTimers = gameData.objectives.map(objective => ({
      name: objective.name,
      respawnTime: objective.nextSpawn || 0,
      priority: this.calculateObjectivePriority(objective, gameData),
      teamCanTake: this.canTeamTakeObjective(objective, gameData)
    }));
  }

  private updateLanePriorities(gameData: GameData) {
    const lanes: Lane[] = ['top', 'mid', 'bot'];
    
    this.currentState.lanePriorities = lanes.map(lane => {
      const pushFactor = this.calculatePushFactor(lane, gameData);
      const gankability = this.calculateGankability(lane, gameData);
      
      return {
        lane,
        pushFactor,
        gankability,
        priority: (pushFactor + gankability) / 2
      };
    });
  }

  // Helper methods
  private calculateCampEfficiency(camp: CampData, gameTime: number): number {
    let efficiency = 1.0;
    
    if (camp.isAlive) {
      efficiency += 0.5;
    }
    
    if (camp.respawnTime && camp.respawnTime <= gameTime + 30) {
      efficiency += 0.3;
    }
    
    return Math.min(efficiency, 2.0);
  }

  private calculateOptimalClearTime(camp: CampData, gameTime: number): number {
    if (camp.isAlive) {
      return gameTime;
    }
    return camp.respawnTime || gameTime + 135;
  }

  private getNextScuttleSpawn(currentTime: number): number {
    const firstSpawn = 210; // 3:30
    const respawnInterval = 150; // 2:30
    
    if (currentTime < firstSpawn) {
      return firstSpawn;
    }
    
    const timeSinceFirst = currentTime - firstSpawn;
    const spawnCycle = Math.floor(timeSinceFirst / respawnInterval);
    return firstSpawn + (spawnCycle + 1) * respawnInterval;
  }

  private calculateScuttlePriority(side: 'top' | 'bottom', gameData: GameData): number {
    let priority = 0.5;
    
    // Higher priority for bottom scuttle when dragon is up
    if (side === 'bottom' && gameData.gameTime >= 300) {
      priority += 0.3;
    }
    
    // Higher priority for top scuttle when herald is up  
    if (side === 'top' && gameData.gameTime >= 480 && gameData.gameTime < 1200) {
      priority += 0.2;
    }
    
    return Math.min(priority, 1.0);
  }

  // Placeholder methods for complex calculations
  private getPlayerTeam(playerName: string, players: any[]): string {
    const player = players.find(p => p.summonerName === playerName);
    return player?.team || 'ORDER';
  }

  private isJunglerRole(player: any): boolean {
    return player.spells?.includes('Smite') || false;
  }

  private calculateEstimationConfidence(playerPos: { x: number; y: number }, campPos: { x: number; y: number }): number {
    const distance = Math.sqrt(Math.pow(campPos.x - playerPos.x, 2) + Math.pow(campPos.y - playerPos.y, 2));
    return Math.max(0.1, 1.0 - distance / 5000);
  }

  private calculateObjectivePriority(objective: any, gameData: GameData): number {
    return 0.6; // Placeholder
  }

  private canTeamTakeObjective(objective: any, gameData: GameData): boolean {
    return gameData.level >= 6; // Simplified check
  }

  private calculatePushFactor(lane: Lane, gameData: GameData): number {
    return Math.random(); // Placeholder - would analyze minion waves
  }

  private calculateGankability(lane: Lane, gameData: GameData): number {
    return Math.random(); // Placeholder - would analyze enemy positions
  }
}
