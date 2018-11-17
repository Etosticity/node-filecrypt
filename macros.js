'use strict';

const chalk = require('chalk');

module.exports = {
  debugLog: string => chalk.cyan(string),
  infoLog: string => chalk.blue(string),
  warnLog: string => chalk.red(string),
  errorLog: string => chalk.bgRed.black(string),
  fatalLog: string => chalk.bgRed.yellow(string),
  resetLog: string => chalk.reset(string)
}