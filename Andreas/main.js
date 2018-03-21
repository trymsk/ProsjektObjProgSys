const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ElectronTitlebarWindows = require('electron-titlebar-windows');
const titlebar = new ElectronTitlebarWindows("darkMode");

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL('file://' + __dirname + '/login.html');
});

titlebar.appendTo(login.html);
titlebar.on('close', function(e) {
    console.log('close');
});

app.on('window-all-closed', () => {
  app.quit();
});
