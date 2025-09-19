import { JungleState, GameData, CampState, JungleCamp } from '../shared/types';

export class JungleTracker {
  private currentState: JungleState;

  constructor() {
    this.currentState = this.initializeState();
  }

  private initializeState(): JungleState {
    const defaultCamp: CampState = {
      respawnTime: null,
      lastCleared: null,
      isAlive: true
    };

    const camps: Record<JungleCamp, CampState> = {
      krugs: { ...defaultCamp },
      raptors: { ...defaultCamp },
      red: { ...defaultCamp },
      wolves: { ...defaultCamp },
      blue: { ...defaultCamp },
      gromp: { ...defaultCamp },
      scuttler: { ...defaultCamp },
      dragon: { ...defaultCamp },
      herald: { ...defaultCamp },
      baron: { ...defaultCamp }
    };

    return {
      redSideJungle: { ...camps },
      blueSideJungle: { ...camps },
      objectives: [],
      gameTime: 0
    };
  }

  updateState(gameData: GameData): JungleState {
    this.currentState.gameTime = gameData.gameTime;

    gameData.events.forEach(event => {
      if (event.type === 'camp_cleared' && event.camp) {
        this.updateCampState(event.camp, event.timestamp, event.team);
      }
    });

    this.updateRespawnTimers();
    return this.currentState;
  }

  getCurrentState(): JungleState {
    return { ...this.currentState };
  }

  private updateCampState(camp: JungleCamp, timestamp: number, team?: 'red' | 'blue'): void {
    const respawnTime = this.calculateRespawnTime(camp, timestamp);
    
    if (team === 'red') {
      this.currentState.redSideJungle[camp] = {
        respawnTime,
        lastCleared: timestamp,
        isAlive: false
      };
    } else if (team === 'blue') {
      this.currentState.blueSideJungle[camp] = {
        respawnTime,
        lastCleared: timestamp,
        isAlive: false
      };
    }
  }

  private calculateRespawnTime(camp: JungleCamp, clearedTime: number): number {
    const respawnTimes: Record<JungleCamp, number> = {
      krugs: 135000,
      raptors: 135000,
      red: 300000,
      wolves: 135000,
      blue: 300000,
      gromp: 135000,
      scuttler: 150000,
      dragon: 300000,
      herald: 480000,
      baron: 420000
    };

    return clearedTime + respawnTimes[camp];
  }

  private updateRespawnTimers(): void {
    const now = Date.now();
    
    Object.keys(this.currentState.redSideJungle).forEach(campKey => {
      const camp = campKey as JungleCamp;
      const campState = this.currentState.redSideJungle[camp];
      if (campState.respawnTime && now >= campState.respawnTime) {
        this.currentState.redSideJungle[camp] = {
          respawnTime: null,
          lastCleared: campState.lastCleared,
          isAlive: true
        };
      }
    });

    Object.keys(this.currentState.blueSideJungle).forEach(campKey => {
      const camp = campKey as JungleCamp;
      const campState = this.currentState.blueSideJungle[camp];
      if (campState.respawnTime && now >= campState.respawnTime) {
        this.currentState.blueSideJungle[camp] = {
          respawnTime: null,
          lastCleared: campState.lastCleared,
          isAlive: true
        };
      }
    });
  }
}
