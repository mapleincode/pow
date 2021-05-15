/**
 * @Author: maple
 * @Date: 2020-11-18 09:44:55
 * @LastEditors: maple
 * @LastEditTime: 2021-05-15 19:18:57
 */
const pino = require('pino');
const logger = pino({
  prettyPrint: { colorize: true }
});

module.exports = logger;
