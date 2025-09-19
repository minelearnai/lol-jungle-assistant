export type Lane = 'top' | 'mid' | 'bot';

export interface PlayerData {
  summonerName: string;
  team: 'ORDER' | 'CHAOS';
  level?: number;
  items?: string[];
  spells?: string[];
  position?: { x: number; y: number };
}

export interface ObjectiveTimer {
  name: string;
  respawnTime: number;
  priority: number;
  teamCanTake: boolean;
}

export interface CampData {
  name: string;
  position: { x: number; y: number };
  isAlive: boolean;
  respawnTime?: number;
  lastCleared?: number;
}
