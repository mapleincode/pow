/**
 * @Author: maple
 * @Date: 2021-01-20 11:28:09
 * @LastEditors: maple
 * @LastEditTime: 2021-01-20 11:29:19
 */
const crypto = require('crypto');

exports.md5 = function (text, encoding) {
  return crypto.createHash('md5').update(text, encoding).digest('hex');
};
