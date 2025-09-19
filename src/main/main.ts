import { app, BrowserWindow } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 360,
    webPreferences: {
      nodeIntegration: true,
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

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

console.log('LoL Jungle Assistant started!');
