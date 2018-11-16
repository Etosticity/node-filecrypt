'use strict'

const prompter = require('inquirer')
const nodersa = require('node-rsa')
const fs = require('fs')

const macros = require('./macros')

module.exports = {
  encryptFile: () => {
    console.log('encryptFile!')
  },
  encryptFolder: () => {
    console.log("encryptFolder!")
  },
  decryptFile: () => {
    console.log("decryptFolder!")
  },
  decryptFolder: () => {
    console.log("decryptFolder")
  },
  exportKeys: () => {
    console.log("exportKeys!")
  },
  generateKeys: () => {
    console.warn(macros.warnLog('! Warning! Generating New Key Pairs Will Result In Old Ones Being Erased!'))
    console.warn(macros.warnLog('! Advice To Export Key Pair Before Continuing!'))
    console.warn(macros.warnLog('! Proceed With Caution.'))

    prompter.prompt([
      {
        type: 'confirm',
        name: 'confirmation',
        message: 'Continue?',
        default: false
      }
    ]).then(results => {
      if (!results.confirmation) {
        console.warn(macros.warnLog('New Key Pair Generation Aborted. No files were changed.'))
        return process.exit(1)
      }

      if (!fs.existsSync(`${process.cwd()}/.rsakeys/`)) {
        fs.mkdirSync(`${process.cwd()}/.rsakeys/`)
      }

      console.log(macros.infoLog('Generating New Key Pair Now. It might take awhile.'))

      const key = new nodersa().generateKeyPair(4096)

      fs.writeFileSync(`${process.cwd()}/.rsakeys/public.txt`, key.exportKey('public'), 'utf8', err => {
        if (err) {
          console.clear()
          console.error(macros.errorLog('[Modules:generateKeys:createPublicKey:Error'), macros.resetLog('An Error Occured. Please see below.'))
          console.error(err)
          return process.exit(1)
        }
      })

      fs.writeFileSync(`${process.cwd()}/.rsakeys/private.txt`, key.exportKey('private'), 'utf8', err => {
        if (err) {
          console.clear()
          console.error(macros.errorLog('[Modules:generateKeys:createPrivateKey:Error'), macros.resetLog('An Error Occured. Please see below.'))
          console.error(err)
          return process.exit(1)
        }
      })

      return console.log(macros.infoLog('Success! New Key Pairs Have Been Generated!'))
    }).catch(err => {
      console.clear()
      console.error(macros.errorLog('[Modules:generateKeys:Error]'), macros.resetLog('An Error Occured. Please see below.'))
      console.error(err)
      return process.exit(1)
    })
  }
}