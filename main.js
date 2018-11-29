'use strict'

// Libraries
const prompter = require('inquirer')

// Package Libraries
const macros = require('./macros')
const modules = require('./modules')

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