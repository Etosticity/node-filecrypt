'use strict'

const Inquirer = require('inquirer')
const Modules = require('./modules')

async function main() {
  console.clear()

  await Inquirer.prompt([
    {
      type: 'list',
      name: 'selection',
      message: 'What To Do?',
      choices: [
        'Encrypt A File',
        'Encrypt A Folder',
        'Decrypt A File',
        'Decrypt A Folder',
        new Inquirer.Separator(),
        'Export Current Key Pair',
        'Generate A New Key Pair',
      ]
    }
  ]).then(result => {
    switch (result.selection) {
      case 'Encrypt A File':
        Modules.encryptFile()
        break;
      case 'Encrypt A Folder':
        console.log(2)
        break;
      case 'Decrypt A File':
        console.log(3)
        break;
      case 'Decrypt A Folder':
        console.log(4)
        break;
      case 'Export Current Key Pair':
        console.log(5)
        break;
      case 'Generate A New Key Pair':
        Modules.generateKeys()
        break;
      default:
        console.log("I'm sorry, invalid selection!")
        process.exit(1)
    }
  })
}

main()