import type { JungleState } from './JungleTracker';

export interface PathStep {
  name: string;
  eta: number;
  expectedGold: number;
  expectedXP: number;
}

export function calculateOptimalPath(
  championName: string,
  gameTime: number,
  jungleState: JungleState
): PathStep[] {
  // Basic pathing algorithm - prioritize by efficiency
  const availableCamps = jungleState.ownCamps
    .filter(camp => camp.isAlive || (camp.respawnTime && camp.respawnTime <= gameTime + 60))
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, 4);

  return availableCamps.map((camp, index) => ({
    name: camp.name,
    eta: gameTime + (index * 25), // Estimated 25 seconds between camps
    expectedGold: this.getCampGoldValue(camp.name),
    expectedXP: this.getCampXPValue(camp.name)
  }));
}

function getCampGoldValue(campName: string): number {
  const goldValues: Record<string, number> = {
    'Blue Buff': 110,
    'Red Buff': 110,
    'Gromp': 85,
    'Krugs': 125,
    'Raptors': 95,
    'Wolves': 85
  };
  return goldValues[campName] || 90;
}

function getCampXPValue(campName: string): number {
  const xpValues: Record<string, number> = {
    'Blue Buff': 135,
    'Red Buff': 135,
    'Gromp': 105,
    'Krugs': 155,
    'Raptors': 115,
    'Wolves': 105
  };
  return xpValues[campName] || 110;
}
