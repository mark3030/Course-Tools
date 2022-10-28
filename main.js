const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const package = require('./package.json');
const { host, port, distDir } = require('./compile/app.config');
const isMac = process.platform === 'darwin';

const template = [
  ...(isMac ? [{
    label: package.name,
    submenu: [
      { role: 'about', label: `关于 ${package.name}` },
      { type: 'separator' },
      { role: 'hide', label: `隐藏 ${package.name}` },
      { role: 'unhide', label: `显示 ${package.name}` },
      { type: 'separator' },
      { role: 'quit', label: `退出 ${package.name}` }
    ]
  }] : []),
  {
    label: '视图',
    submenu: [
      { role: 'reload', label: "重新加载" },
      { role: 'forceReload', label: "强制加载" },
      { role: 'toggleDevTools', label: "检查" }
    ]
  },
  {
    role: 'help',
    label: '帮助',
    submenu: [
      {
        label: '更多',
        click: async () => await shell.openExternal('https://platform.dt-pf.com')
      }
    ]
  }
];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.on('ready', function() {
    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        fullscreen: isMac,
        webPreferences: {
          javascript: true,
          plugins: true,
          nodeIntegration: false, // 不集成 Nodejs
          webSecurity: true,
          contextIsolation: false
        }
    });

    if(process.env.NODE_ENV === "development") {
        mainWindow.webContents.openDevTools();
        mainWindow.loadURL(`http://${host}:${port}`);
    } else if(process.env.NODE_ENV === "pre") {
        mainWindow.webContents.openDevTools();
        const homepage = path.join(__dirname, distDir, 'index.html');
        mainWindow.loadFile(homepage);
    } else {
        // const homepage = path.join(__dirname, 'app.asar', 'index.html');
        const homepage = path.join(__dirname, distDir, 'index.html');
        mainWindow.loadFile(homepage);
    }
}).on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit();
});