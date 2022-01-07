const { app, BrowserWindow } = require('electron');
const path = require('path');
const EventEmitter = require('events')
const loadingEvents = new EventEmitter()
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createLoadingWindow = () => {

  // Create the browser window.
  const loadingWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    width: 600,
    height: 400,
    frame: false,
    transparent: true
  });

  loadingWindow.loadFile(path.join(__dirname, 'loading.html'));
  loadingEvents.on('finished', () => {
    loadingWindow.close();
  })

  // and load the index.html of the app.

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};





const createMainWindow = () => {

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false,
    width: 1100,
    height: 700,
    autoHideMenuBar: true //hide menu bar
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  loadingEvents.on('finished', () => {
    mainWindow.show();
    // mainWindow.webContents.openDevTools();
  })
  // and load the index.html of the app.

  // Open the DevTools.
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createLoadingWindow();
  createMainWindow();

  setTimeout(() => loadingEvents.emit('finished'), 994000);



});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// document.getElementById('testButton').innerHTML="Changed1";
// document.getElementById("mybtestButtonutton").addEventListener("click", () => {
//   const data = "Successfully wrote to the desktop"; // the data we want to save to the desktop
//   //launch save dialog window
//   dialog.showSaveDialog(filename => {
//       //save file at the destination indicated by filename
//       fs.writeFileSync(filename + ".txt", data, "utf-8", () => {
//           console.log("attempted to write to the desktop");
//       });
//   });
// });