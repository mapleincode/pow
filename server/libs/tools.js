/**
 * @Author: maple
 * @Date: 2021-04-20 12:19:24
 * @LastEditors: maple
 * @LastEditTime: 2021-04-20 12:19:25
 */
const crypto = require('crypto');

exports.md5 = exports.hash = function (str, encode = 'md5') {
  return crypto.createHash('md5').update(str, encode).digest('hex');
};
