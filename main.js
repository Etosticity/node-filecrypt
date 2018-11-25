'use strict'

// Libraries
const prompter = require('inquirer')
const minimist = require('minimist')(process.argv.slice(2))

// GUI Libraries
const url = require('url')
const path = require('path')
const { app, BrowserWindow } = require('electron')

// Package Libraries
const macros = require('./macros')
const modules = require('./modules')

// GUI Variables
let mainWindow

function createWindow() {
  // Create new window
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    resizable: false,
    autoHideMenuBar: true,
  })

  // Load page into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Quit application when closed
  mainWindow.on('closed', () => {
    // Dereference mainWindow object
    // to reduce memory footprint
    mainWindow = null
  })
}

function main() {
  // Clear terminal for nicer output
  console.clear()

  prompter.prompt([
    {
      type: 'list',
      name: 'selection',
      message: 'What To Do?',
      choices: [
        'Encrypt A File',
        'Decrypt A File',
        new prompter.Separator(),
        'Export Current Key Pair',
        'Generate A New Key Pair',
      ]
    }
  ]).then(result => {
    switch (result.selection) {
      case 'Encrypt A File':
        modules.encryptFile()
        break;
      case 'Decrypt A File':
        modules.decryptFile()
        break;
      case 'Export Current Key Pair':
        console.log('Feature Coming Soon!')
        break;
      case 'Generate A New Key Pair':
        modules.generateKeys()
        break;
      default:
        macros.errorLog('Invalid Selection! Program Exited.')
        process.exit(1)
    }
  })
}

if (minimist.console) return main()

// Create the mainWindow when Electron
// has finished initializing
// app.on('ready', createWindow)
app.on('ready', createWindow)

// Quit the application when all
// windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Re-create the mainWindow when dock
// icon is clicked and there are no
// active windows open
app.on('activate', () => {
  // Re-initialize mainWindow
  if (win === null) createWindow()
})