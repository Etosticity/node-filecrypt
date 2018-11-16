'use strict';

const Chalk = require('chalk');

module.exports = {
  debugLog: string => Chalk.cyan(string),
  infoLog: string => Chalk.blue(string),
  warnLog: string => Chalk.red(string),
  errorLog: string => Chalk.bgRed.black(string),
  fatalLog: string => Chalk.bgRed.yellow(string),
  resetLog: string => Chalk.reset(string)
}