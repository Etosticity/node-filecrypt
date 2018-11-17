'use strict'

const prompter = require('inquirer')
const modules = require('./modules')

const macros = require('./macros')

async function main() {
  console.clear()

  await prompter.prompt([
    {
      type: 'list',
      name: 'selection',
      message: 'What To Do?',
      choices: [
        'Encrypt A File',
        'Encrypt A Folder',
        'Decrypt A File',
        'Decrypt A Folder',
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
      case 'Encrypt A Folder':
        console.log('Feature Coming Soon!')
        break;
      case 'Decrypt A File':
        modules.decryptFile()
        break;
      case 'Decrypt A Folder':
        console.log('Feature Coming Soon!')
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

main()