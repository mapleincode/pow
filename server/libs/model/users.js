/**
 * @Author: maple
 * @Date: 2021-01-18 11:58:17
 * @LastEditors: maple
 * @LastEditTime: 2021-04-07 10:35:20
 */
const DB = require('../db');
const mysql = DB.get('arku');

const Users = mysql.qdefine('users', [
  'id, i',
  'name, s',
  'username, s',
  'password, s, $t',
  'dt, s, $t',
  'phone, s, $t',
  'email, s, $t',
  'chanifyTokens, s, $t'
]);

module.exports = Users;
