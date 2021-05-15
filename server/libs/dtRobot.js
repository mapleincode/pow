/**
 * @Author: maple
 * @Date: 2021-01-18 10:27:26
 * @LastEditors: maple
 * @LastEditTime: 2021-05-15 19:12:30
 */
const DTRobot = require('wm-dt-robot').default;
const config = require('../config');
const robot = new DTRobot(config.dtRobot.token, config.dtRobot.secret);

module.exports = robot;
