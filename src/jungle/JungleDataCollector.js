"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JungleDataCollector = void 0;
const axios_1 = __importDefault(require("axios"));
const https_1 = __importDefault(require("https"));
const events_1 = require("events");
const constants_1 = require("../shared/constants");
const httpsAgent = new https_1.default.Agent({
    rejectUnauthorized: false
});
class JungleDataCollector extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.isMonitoring = false;
        this.lastGameTime = 0;
    }
    async checkGameState() {
        try {
            const response = await axios_1.default.get(`${constants_1.LIVE_CLIENT_BASE}/gamedata`, {
                httpsAgent,
                timeout: 1000
            });
            return response.data && response.data.gameMode === 'CLASSIC';
        }
        catch {
            return false;
        }
    }
    async startMonitoring(intervalMs = 3000) {
        if (this.isMonitoring)
            return;
        this.isMonitoring = true;
        console.log(`Starting jungle data collection (${intervalMs}ms interval)`);
        this.monitoringInterval = setInterval(async () => {
            try {
                const gameData = await this.collectGameData();
                this.emit('gameData', gameData);
            }
            catch (error) {
                console.warn('Data collection error:', error.message);
            }
        }, intervalMs);
    }
    stopMonitoring() {
        this.isMonitoring = false;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            console.log('Stopped jungle data collection');
        }
    }
    async collectGameData() {
        const [allGameData, playerList] = await Promise.all([
            this.getAllGameData(),
            this.getPlayerList()
        ]);
        const activePlayer = allGameData.activePlayer || {};
        const gameData = allGameData.gameData || {};
        this.lastGameTime = gameData.gameTime || 0;
        return {
            gameTime: this.lastGameTime,
            playerName: activePlayer.summonerName || 'Player',
            currentGold: activePlayer.currentGold || 0,
            level: activePlayer.level || 1,
            position: activePlayer.position || { x: 0, y: 0 },
            camps: this.estimateJungleCamps(this.lastGameTime),
            objectives: this.extractObjectiveData(allGameData.events),
            players: this.processPlayerList(playerList)
        };
    }
    async getAllGameData() {
        const response = await axios_1.default.get(`${constants_1.LIVE_CLIENT_BASE}/allgamedata`, {
            httpsAgent,
            timeout: 2000
        });
        return response.data;
    }
    async getPlayerList() {
        const response = await axios_1.default.get(`${constants_1.LIVE_CLIENT_BASE}/playerlist`, {
            httpsAgent,
            timeout: 2000
        });
        return response.data;
    }
    estimateJungleCamps(gameTime) {
        // Standard jungle camp positions (blue side)
        const campDefinitions = [
            { name: 'Blue Buff', position: { x: 3800, y: 7900 } },
            { name: 'Gromp', position: { x: 2100, y: 8400 } },
            { name: 'Wolves', position: { x: 3300, y: 6500 } },
            { name: 'Raptors', position: { x: 6900, y: 5400 } },
            { name: 'Red Buff', position: { x: 7100, y: 4100 } },
            { name: 'Krugs', position: { x: 8400, y: 2700 } }
        ];
        return campDefinitions.map(camp => ({
            name: camp.name,
            position: camp.position,
            isAlive: true, // Default assumption - would need game events to track actual state
            respawnTime: gameTime + (constants_1.CAMP_RESPAWN_TIMES[camp.name] || 135)
        }));
    }
    extractObjectiveData(events) {
        const objectives = [];
        const eventList = events?.Events || [];
        // Dragon tracking
        const dragonKills = eventList.filter((e) => e.EventName === 'DragonKill');
        if (dragonKills.length > 0) {
            const lastDragon = dragonKills[dragonKills.length - 1];
            objectives.push({
                name: 'Dragon',
                nextSpawn: lastDragon.EventTime + 300, // 5 minutes
                type: 'neutral'
            });
        }
        else {
            objectives.push({
                name: 'Dragon',
                nextSpawn: 300, // First dragon at 5:00
                type: 'neutral'
            });
        }
        // Herald/Baron tracking
        if (this.lastGameTime >= 1500) { // 25:00 - Baron spawns
            objectives.push({
                name: 'Baron',
                nextSpawn: 1500,
                type: 'neutral'
            });
        }
        else if (this.lastGameTime >= 480) { // 8:00 - Herald spawns
            objectives.push({
                name: 'Herald',
                nextSpawn: 480,
                type: 'neutral'
            });
        }
        return objectives;
    }
    processPlayerList(playerList) {
        return (playerList || []).map(player => ({
            summonerName: player.summonerName,
            team: player.team,
            level: player.level,
            items: player.items?.map((item) => item.displayName) || [],
            spells: [
                player.summonerSpells?.summonerSpellOne?.displayName,
                player.summonerSpells?.summonerSpellTwo?.displayName
            ].filter(Boolean),
            position: player.position
        }));
    }
}
exports.JungleDataCollector = JungleDataCollector;
