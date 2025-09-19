// Core jungle camp types
export type Lane = 'top' | 'mid' | 'bot';

export type JungleCamp = 
  | 'krugs' 
  | 'raptors' 
  | 'red' 
  | 'wolves' 
  | 'blue' 
  | 'gromp' 
  | 'scuttler' 
  | 'dragon' 
  | 'herald' 
  | 'baron';

export interface CampState {
  respawnTime: number | null;
  lastCleared: number | null;
  isAlive: boolean;
}

export interface ObjectiveTimer {
  name: string;
  respawnTime: number;
  priority: number;
  teamCanTake: boolean;
  location: { x: number; y: number };
}

export interface JungleState {
  redSideJungle: Record<JungleCamp, CampState>;
  blueSideJungle: Record<JungleCamp, CampState>;
  objectives: ObjectiveTimer[];
  gameTime: number;
}

export interface GameData {
  gameTime: number;
  playerTeam: 'red' | 'blue';
  events: GameEvent[];
  playerPosition: { x: number; y: number };
  playerChampion: string;
  playerLevel: number;
  playerGold: number;
}

export interface GameEvent {
  type: 'camp_cleared' | 'objective_taken' | 'player_death' | 'enemy_spotted';
  timestamp: number;
  camp?: JungleCamp;
  player?: string;
  team?: 'red' | 'blue';
  location?: { x: number; y: number };
}

export interface JungleRecommendation {
  id: string;
  type: 'camp' | 'objective' | 'gank' | 'recall';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timeframe: number; // seconds until action should be taken
  target?: JungleCamp | Lane;
  reasoning: string[];
}

export interface AppConfig {
  summoner_name: string;
  region: string;
  update_interval_seconds: number;
  auto_start: boolean;
  overlay_enabled: boolean;
  notifications_enabled: boolean;
  sound_enabled: boolean;
  debug_mode: boolean;
  hotkeys: {
    toggle_overlay: string;
    toggle_sound: string;
  };
  ui: {
    theme: 'dark' | 'light';
    opacity: number;
    scale: number;
  };
}

export interface OverwolfEvents {
  gameInfo: any;
  gameEvents: any;
  launchEvents: any;
}