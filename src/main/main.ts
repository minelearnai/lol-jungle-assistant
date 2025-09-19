import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { OverwolfManager } from './overwolf-manager';
import { ConfigManager } from './config-manager';
import { JungleDataCollector } from '../jungle/JungleDataCollector';
import { JungleTracker } from '../jungle/JungleTracker';  
import { JungleDecisionEngine } from '../jungle/JungleDecisionEngine';

let mainWindow: BrowserWindow | null = null;

const overwolfManager = new OverwolfManager();
const configManager = new ConfigManager();
const dataCollector = new JungleDataCollector();
const jungleTracker = new JungleTracker();
const decisionEngine = new JungleDecisionEngine();

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 360,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false
    },
    show: true,
    icon: path.join(__dirname, '../../assets/icons/icon.png')
  });

  await mainWindow.loadFile(path.join(__dirname, '../../public/index.html'));
  
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

async function initialize() {
  await configManager.loadConfig();
  await overwolfManager.initialize();
  await createMainWindow();

  // Setup jungle data pipeline
  dataCollector.on('gameData', (gameData) => {
    const jungleState = jungleTracker.updateState(gameData);
    const recommendations = decisionEngine.getRecommendations(jungleState, gameData);
    
    // Send updates to renderer processes
    mainWindow?.webContents.send('jungle-update', {
      state: jungleState,
      recommendations
    });
  });

  // Start monitoring if in game
  const isInGame = await dataCollector.checkGameState();
  if (isInGame) {
    console.log('League of Legends detected, starting monitoring...');
    const config = configManager.getConfig();
    await dataCollector.startMonitoring(config.update_interval_seconds * 1000);
  }
}

// App event handlers
app.whenReady().then(initialize);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// IPC handlers
ipcMain.handle('get-config', () => configManager.getConfig());
ipcMain.handle('update-config', (_, config) => configManager.updateConfig(config));
ipcMain.handle('get-jungle-state', () => jungleTracker.getCurrentState());
ipcMain.handle('check-game-state', () => dataCollector.checkGameState());
