'use strict'

// Libraries
const prompter = require('inquirer')
const nodeRSA = require('node-rsa')
const path = require('path')
const fs = require('fs')

// Package Libraries
const macros = require('./macros')

module.exports = {
  // Encrypt Files
  encryptFile: () => {
    prompter.prompt([
      {
        type: 'input',
        name: 'filename',
        message: 'Location Of File?',
        validate: value => {
          if (value === null || value === '') return 'Error: File location required!'
          if (!fs.existsSync(value)) return 'Error: Unable to locate file!'
          if (fs.statSync(value).isDirectory()) return 'Error: Unable to encrypt folders!'

          return true
        }
      },
      {
        type: 'input',
        name: 'rsakeys',
        message: 'Where Are Your Signing Keys?',
        default: () => {
          return path.join(__dirname, '.rsakeys')
        },
        validate: value => {
          if (value === null || value === '') return 'Error: Key Pair Location Required!'
          if (!fs.existsSync(path.join(value, 'public.txt') || !fs.existsSync(path.join(value, 'private.txt')))) return 'Error: Unable to locate signing keys!'

          return true
        }
      },
      {
        type: 'confirm',
        name: 'confirmation',
        message: 'Are The Details Correct?',
        default: false
      }
    ]).then(results => {
      if (!results.confirmation) {
        console.warn(macros.errorLog('❌\x20 File Encryption Aborted. No files were changed.'))
        return process.exit(1)
      }

      console.log(macros.infoLog('Encrypting File Now. It might take awhile.'))

      const fileData = fs.readFileSync(results.filename, 'utf8')
      const keyData = fs.readFileSync(path.join(results.rsakeys, 'public.txt'), 'utf8')
      const start = new Date()
      const key = new nodeRSA()
      key.importKey(keyData)

      fs.writeFileSync(results.filename, key.encrypt(fileData, 'base64'), 'utf8')

      return console.log(macros.infoLog(`✔\x20Success! File Has Been Encrypted. Took ${new Date() - start}ms`))
    }).catch(err => {
      console.clear()
      console.error(macros.errorLog('[Modules:encryptFile:Error]'), macros.resetLog('An Error Occured. Please see below.'))
      console.error(err)
      return process.exit(1)
    })
  },
  // Decrypt Files
  decryptFile: () => {
    prompter.prompt([
      {
        type: 'input',
        name: 'filename',
        message: 'Location Of File?',
        validate: value => {
          if (value === null || value === '') return 'Error: File location required!'
          if (!fs.existsSync(value)) return 'Error: Unable to locate file!'
          if (fs.statSync(value).isDirectory()) return 'Error: Unable to decrypt folders!'

          return true
        }
      },
      {
        type: 'input',
        name: 'rsakeys',
        message: 'Where Are Your Signing Keys?',
        default: () => {
          return path.join(__dirname, '.rsakeys')
        },
        validate: value => {
          if (value === null || value === '') return 'Error: Key Pair Location Required!'
          if (!fs.existsSync(path.join(value, 'public.txt')) || !fs.existsSync(path.join(value, 'private.txt'))) return 'Error: Unable to locate signing keys!'

          return true
        }
      },
      {
        type: 'confirm',
        name: 'confirmation',
        message: 'Are The Details Correct?',
        default: false
      }
    ]).then(results => {
      if (!results.confirmation) {
        console.warn(macros.errorLog('❌\x20 File Decryption Aborted. No files were changed.'))
        return process.exit(1)
      }

      console.log(macros.infoLog('Decrypting File Now. It might take awhile.'))

      const fileData = fs.readFileSync(results.filename, 'utf8')
      const keyData = fs.readFileSync(path.join(results.rsakeys, 'private.txt'), 'utf8')
      const start = new Date()
      const key = new nodeRSA()
      key.importKey(keyData)

      fs.writeFileSync(results.filename, key.decrypt(fileData, 'utf8'), 'utf8')

      return console.log(macros.infoLog(`✔\x20Success! File Has Been Decrypted. Took ${new Date() - start}ms`))
    }).catch(err => {
      console.clear()
      console.error(macros.errorLog('[Modules:decryptFile:Error]'), macros.resetLog('An Error Occured. Please see below.'))
      console.error(err)
      return process.exit(1)
    })
  },
  // Generate New RSA Key Pairs
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
        console.warn(macros.errorLog('❌\x20 New Key Pair Generation Aborted. No files were changed.'))
        return process.exit(1)
      }

      if (!fs.existsSync(path.join(__dirname, '.rsakeys'))) fs.mkdirSync(path.join(__dirname, '.rsakeys'))

      console.log(macros.infoLog('Generating New Key Pair Now. It might take awhile.'))

      const start = new Date()
      const key = new nodeRSA().generateKeyPair(4096)

      fs.writeFileSync(path.join(__dirname, '.rsakeys', 'public.txt'), key.exportKey('public'), 'utf8')
      fs.writeFileSync(path.join(__dirname, '.rsakeys', 'private.txt'), key.exportKey('private'), 'utf8')
      fs.writeFileSync(path.join(__dirname, '.rsakeys', 'README.txt'), `
      RSA Keys Generated By node-filecrypt
      https://github.com/etosticity/node-filecrypt

      Please do not tamper or modify any files in this ".rsakeys" directory
      to avoid irreversible damage to your encrypted files using existing
      RSA key pairs.

      If you would like to export your key pair, please do so carefully.

      Only export files "public.txt" and "private.txt", no other.

      Last RSA Key Pair Generation: ${new Date()}
      `, 'utf8')

      return console.log(macros.infoLog(`✔\x20Success! New Key Pairs Have Been Generated! Took ${new Date() - start}ms`))
    }).catch(err => {
      console.clear()
      console.error(macros.errorLog('[Modules:generateKeys:Error]'), macros.resetLog('An Error Occured. Please see below.'))
      console.error(err)
      return process.exit(1)
    })
  }
}