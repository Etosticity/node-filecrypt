'use strict'

const prompter = require('inquirer')
const nodeRSA = require('node-rsa')
const fs = require('fs')

const macros = require('./macros')

function encrypt(filename, keylocation) {
  try {
    const fileData = fs.readFileSync(filename, 'utf8')
    const keyData = fs.readFileSync(`${keylocation}/public.txt`, 'utf8')
    const start = new Date()
    const key = new nodeRSA()
    key.importKey(keyData)

    fs.writeFileSync(`${filename}`, key.encrypt(fileData, 'base64'), 'utf8')

    return console.log(macros.infoLog(`✔\x20Success! File Has Been Encrypted. Took ${new Date() - start}ms`))
  } catch (err) {
    console.clear()
    console.error(macros.errorLog('[Modules:encryptFile:encrypt:Error]'), macros.resetLog('An Error Occured. Please see below.'))
    console.error(err)
    return process.exit(1)
  }
}

function decrypt(filename, keylocation) {
  try {
    const fileData = fs.readFileSync(filename, 'utf8')
    const keyData = fs.readFileSync(`${keylocation}/private.txt`, 'utf8')
    const start = new Date()
    const key = new nodeRSA()
    key.importKey(keyData)

    fs.writeFileSync(`${filename}`, key.decrypt(fileData, 'utf8'), 'utf8')

    return console.log(macros.infoLog(`✔\x20Success! File Has Been Decrypted. Took ${new Date() - start}ms`))
  } catch (err) {
    console.clear()
    console.error(macros.errorLog('[Modules:decryptFile:decrypt:Error]'), macros.resetLog('An Error Occured. Please see below.'))
    console.error(err)
    return process.exit(1)
  }
}

module.exports = {
  encryptFile: () => {
    prompter.prompt([
      {
        type: 'input',
        name: 'filename',
        message: 'Location Of File?',
        validate: value => {
          if (value === null || value === '') return 'Error: File Location Required!'
          if (!fs.existsSync(value)) return 'Error: Unable to locate file!'

          return true
        }
      },
      {
        type: 'input',
        name: 'rsakeys',
        message: 'Where Are Your Signing Keys?',
        default: () => {
          return `${__dirname}/.rsakeys/`
        },
        validate: value => {
          if (value === null || value === '') return 'Error: Key Pair Location Required!'
          if (!fs.existsSync(`${value}/public.txt`) || !fs.existsSync(`${value}/private.txt`)) return 'Error: Unable to locate signing keys!'

          return true
        }
      },
      {
        type: 'confirm',
        name: 'confirmation',
        message: 'Are The Above Details Correct?',
        default: false
      }
    ]).then(results => {
      if (!results.confirmation) {
        console.warn(macros.errorLog('❌\x20 File Encryption Aborted. No files were changed.'))
        return process.exit(1)
      }

      console.log(macros.infoLog('Encrypting File Now. It might take awhile.'))

      return encrypt(results.filename, results.rsakeys)
    }).catch(err => {
      console.clear()
      console.error(macros.errorLog('[Modules:encryptFile:Error]'), macros.resetLog('An Error Occured. Please see below.'))
      console.error(err)
      return process.exit(1)
    })
  },
  encryptFolder: () => {
    console.log("encryptFolder!")
  },
  decryptFile: () => {
    prompter.prompt([
      {
        type: 'input',
        name: 'filename',
        message: 'Location Of File?',
        validate: value => {
          if (value === null || value === '') return 'Error: File Location Required!'
          if (!fs.existsSync(value)) return 'Error: Unable to locate file!'

          return true
        }
      },
      {
        type: 'input',
        name: 'rsakeys',
        message: 'Where Are Your Signing Keys?',
        default: () => {
          return `${__dirname}/.rsakeys/`
        },
        validate: value => {
          if (value === null || value === '') return 'Error: Key Pair Location Required!'
          if (!fs.existsSync(`${value}/public.txt`) || !fs.existsSync(`${value}/private.txt`)) return 'Error: Unable to locate signing keys!'

          return true
        }
      },
      {
        type: 'confirm',
        name: 'confirmation',
        message: 'Are The Above Details Correct?',
        default: false
      }
    ]).then(results => {
      if (!results.confirmation) {
        console.warn(macros.errorLog('❌\x20 File Decryption Aborted. No files were changed.'))
        return process.exit(1)
      }

      console.log(macros.infoLog('Decrypting File Now. It might take awhile.'))

      return decrypt(results.filename, results.rsakeys)
    }).catch(err => {
      console.clear()
      console.error(macros.errorLog('[Modules:decryptFile:Error]'), macros.resetLog('An Error Occured. Please see below.'))
      console.error(err)
      return process.exit(1)
    })
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
        console.warn(macros.errorLog('❌\x20 New Key Pair Generation Aborted. No files were changed.'))
        return process.exit(1)
      }

      if (!fs.existsSync(`${__dirname}/.rsakeys/`)) {
        fs.mkdirSync(`${__dirname}/.rsakeys/`)
      }

      console.log(macros.infoLog('Generating New Key Pair Now. It might take awhile.'))

      const start = new Date()
      const key = new nodeRSA().generateKeyPair(4096)

      fs.writeFileSync(`${__dirname}/.rsakeys/public.txt`, key.exportKey('public'), 'utf8')
      fs.writeFileSync(`${__dirname}/.rsakeys/private.txt`, key.exportKey('private'), 'utf8')

      return console.log(macros.infoLog(`✔\x20Success! New Key Pairs Have Been Generated! Took ${new Date() - start}ms`))
    }).catch(err => {
      console.clear()
      console.error(macros.errorLog('[Modules:generateKeys:Error]'), macros.resetLog('An Error Occured. Please see below.'))
      console.error(err)
      return process.exit(1)
    })
  }
}