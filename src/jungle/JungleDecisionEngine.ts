import { JungleRecommendation, JungleState, GameData, JungleCamp } from '../shared/types';

export class JungleDecisionEngine {
  getRecommendations(jungleState: JungleState, gameData: GameData): JungleRecommendation[] {
    const recommendations: JungleRecommendation[] = [];

    const availableCamps = this.findAvailableCamps(jungleState, gameData.playerTeam);
    if (availableCamps.length > 0) {
      recommendations.push({
        id: `camp-${Date.now()}`,
        type: 'camp',
        priority: 'medium',
        title: 'Available Jungle Camps',
        description: `Clear available camps: ${availableCamps.join(', ')}`,
        timeframe: 30,
        target: availableCamps[0],
        reasoning: ['Efficient farming', 'Gold and XP gain']
      });
    }

    const upcomingRespawns = this.findUpcomingRespawns(jungleState);
    if (upcomingRespawns.length > 0) {
      recommendations.push({
        id: `respawn-${Date.now()}`,
        type: 'camp',
        priority: 'low',
        title: 'Upcoming Respawns',
        description: `Camps respawning soon: ${upcomingRespawns.join(', ')}`,
        timeframe: 60,
        reasoning: ['Timing optimization', 'Route planning']
      });
    }

    return recommendations.slice(0, 5);
  }

  private findAvailableCamps(jungleState: JungleState, playerTeam: 'red' | 'blue'): JungleCamp[] {
    const availableCamps: JungleCamp[] = [];
    const teamJungle = playerTeam === 'blue' ? jungleState.blueSideJungle : jungleState.redSideJungle;

    Object.entries(teamJungle).forEach(([campName, campState]) => {
      if (campState.isAlive && !campState.respawnTime) {
        availableCamps.push(campName as JungleCamp);
      }
    });

    return availableCamps;
  }

  private findUpcomingRespawns(jungleState: JungleState): JungleCamp[] {
    const upcomingRespawns: JungleCamp[] = [];
    const now = Date.now();
    const threshold = 30000;

    const checkJungle = (jungle: Record<JungleCamp, any>) => {
      Object.entries(jungle).forEach(([campName, campState]) => {
        if (campState.respawnTime && campState.respawnTime - now <= threshold) {
          upcomingRespawns.push(campName as JungleCamp);
        }
      });
    };

    checkJungle(jungleState.blueSideJungle);
    checkJungle(jungleState.redSideJungle);

    return upcomingRespawns;
  }
}
