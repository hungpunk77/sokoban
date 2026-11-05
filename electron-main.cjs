const { app, BrowserWindow } = require('electron');
const path = require('path');

// Kényszerítsük a Linuxot, hogy összekösse az ablakot a .desktop fájllal
if (process.platform === 'linux') {
  app.setAppUserModelId('sokoban');
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    title: 'Sokoban',
    backgroundColor: '#020617',

    // JAVÍTOTT IKON ELÉRÉS: először a kicsomagolt fix helyen keresi, ha nincs, a beépített másolatban
    icon: path.join(app.getPath('home'), '.local/share/icons/hicolor/256x256/apps/sokoban.png'),

                                webPreferences: {
                                  nodeIntegration: false,
                                contextIsolation: true,
                                },
                                autoHideMenuBar: true,
  });

  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
