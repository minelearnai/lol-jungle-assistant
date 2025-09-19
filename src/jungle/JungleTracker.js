"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JungleTracker = void 0;
class JungleTracker {
    constructor() {
        this.campHistory = new Map();
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
    updateState(gameData) {
        this.updateOwnCamps(gameData);
        this.updateEnemyCampEstimation(gameData);
        this.updateScuttlePriority(gameData);
        this.updateObjectiveTimers(gameData);
        this.updateLanePriorities(gameData);
        this.currentState.lastUpdated = Date.now();
        return this.currentState;
    }
    getCurrentState() {
        return { ...this.currentState };
    }
    updateOwnCamps(gameData) {
        this.currentState.ownCamps = gameData.camps.map(camp => ({
            ...camp,
            efficiency: this.calculateCampEfficiency(camp, gameData.gameTime),
            nextOptimal: this.calculateOptimalClearTime(camp, gameData.gameTime)
        }));
    }
    updateEnemyCampEstimation(gameData) {
        // Find enemy jungler
        const enemyJungler = gameData.players.find(player => player.team !== this.getPlayerTeam(gameData.playerName, gameData.players) &&
            this.isJunglerRole(player));
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
                confidence: this.calculateEstimationConfidence(enemyJungler.position, camp.position)
            }));
        }
    }
    updateScuttlePriority(gameData) {
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
    updateObjectiveTimers(gameData) {
        this.currentState.objectiveTimers = gameData.objectives.map(objective => ({
            name: objective.name,
            respawnTime: objective.nextSpawn || 0,
            priority: this.calculateObjectivePriority(objective, gameData),
            teamCanTake: this.canTeamTakeObjective(objective, gameData)
        }));
    }
    updateLanePriorities(gameData) {
        const lanes = ['top', 'mid', 'bot'];
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
    calculateCampEfficiency(camp, gameTime) {
        let efficiency = 1.0;
        if (camp.isAlive) {
            efficiency += 0.5;
        }
        if (camp.respawnTime && camp.respawnTime <= gameTime + 30) {
            efficiency += 0.3;
        }
        return Math.min(efficiency, 2.0);
    }
    calculateOptimalClearTime(camp, gameTime) {
        if (camp.isAlive) {
            return gameTime;
        }
        return camp.respawnTime || gameTime + 135;
    }
    getNextScuttleSpawn(currentTime) {
        const firstSpawn = 210; // 3:30
        const respawnInterval = 150; // 2:30
        if (currentTime < firstSpawn) {
            return firstSpawn;
        }
        const timeSinceFirst = currentTime - firstSpawn;
        const spawnCycle = Math.floor(timeSinceFirst / respawnInterval);
        return firstSpawn + (spawnCycle + 1) * respawnInterval;
    }
    calculateScuttlePriority(side, gameData) {
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
    getPlayerTeam(playerName, players) {
        const player = players.find(p => p.summonerName === playerName);
        return player?.team || 'ORDER';
    }
    isJunglerRole(player) {
        return player.spells?.includes('Smite') || false;
    }
    calculateEstimationConfidence(playerPos, campPos) {
        const distance = Math.sqrt(Math.pow(campPos.x - playerPos.x, 2) + Math.pow(campPos.y - playerPos.y, 2));
        return Math.max(0.1, 1.0 - distance / 5000);
    }
    calculateObjectivePriority(objective, gameData) {
        return 0.6; // Placeholder
    }
    canTeamTakeObjective(objective, gameData) {
        return gameData.level >= 6; // Simplified check
    }
    calculatePushFactor(lane, gameData) {
        return Math.random(); // Placeholder - would analyze minion waves
    }
    calculateGankability(lane, gameData) {
        return Math.random(); // Placeholder - would analyze enemy positions
    }
}
exports.JungleTracker = JungleTracker;
