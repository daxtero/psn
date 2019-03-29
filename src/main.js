const {app, Tray, BrowserWindow, ipcMain} = require('electron');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

let tray = null;
let win = undefined;
let settingsWin = undefined;
let timerId = null;

app.dock.hide();

ipcMain.on('query', async (event, queryString) => {
    let command = 'sh ' + __dirname+ '/psnquery.sh "' + queryString + '"';
console.log(command);
    exec(command, (error, stdout, stderr) => {
	console.log(error, stderr, stdout);
        event.returnValue = stdout;
    });
});

app.on('ready', () => {
    createTray();
    createWindows();
});

const createTray = () => {
    tray = new Tray('./ressources/psn.jpg');
    tray.setToolTip('PSN');
    tray.on('click', (event) => {
        toggleWindow();
    });
    tray.on('right-click', () => {
        win.reload();
        clearInterval();
        startTimer();
    });
};

const updateTray = async () => {
    tray.setToolTip('');
    tray.setHighlightMode('always');
    setTimeout(() => {
        tray.setHighlightMode('selection');
    }, 100);
};

const createWindows = () => {
    let mainHeight = 680;
    let mainWidth = 850;

    win = new BrowserWindow({
        width: mainWidth,
        height: mainHeight,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: true,
        'node-integration': true,
        webPreferences: {
            webSecurity: false,
        },
        allowRunningInsecureContent: true,
    });
    win.setVisibleOnAllWorkspaces(true);
     win.loadURL('file://' + __dirname + '/index.html');
    //win.loadURL('file://' + __dirname + '/extjs/psn/build/production/psn/index.html');
    // win.loadURL('http://localhost:1962');

    // Hide the window when it loses focus
    win.on('blur', () => {
        if (settingsWin && settingsWin.isVisible()) {
            return;
        }
        if (!win.webContents.isDevToolsOpened()) {
            win.hide();
        }
    });

    settingsWin = new BrowserWindow({
        parent: win,
        modal: true,
        width: mainWidth * 0.8,
        height: 680,
        show: false,
        'node-integration': true,
        webPreferences: {
            webSecurity: false,
        },
    });

    settingsWin.loadURL('file://' + __dirname + '/settings.html');

    settingsWin.on('blur', () => {
        settingsWin.hide();
    });

    startTimer();
};

const toggleWindow = () => {
    if (win.isVisible()) {
        win.hide();
        settingsWin.hide();
        startTimer();
    } else {
        showWindow();
        clearInterval();
    }
};

const showWindow = () => {
    const position = getWindowPosition();
    win.setPosition(position.x, position.y, false);
    win.show();
    win.focus();
    clearInterval(timerId);
};

const getWindowPosition = () => {
    const windowBounds = win.getBounds();
    const trayBounds = tray.getBounds();

    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 3);

    return {x: x, y: y}
};

let startTimer = function () {
    clearInterval(timerId);
    timerId = setInterval(() => {
        win.reload();
    }, 5 * 60 * 1000);
};
