/**
 * @Author: maple
 * @Date: 2021-04-07 10:15:58
 * @LastEditors: maple
 * @LastEditTime: 2021-05-15 19:16:18
 */
const config = require('../config');
const request = require('request-promise');

async function sendNotice (token, text, title, options = {}) {
  if (!config.chanify.enable) {
    return;
  }
  const params = {
    token: token,
    text: text,
    title: title + '\n' + text.replace(':\n', ': '),
    sound: 1,
    priority: 10,
    ...options
  };
  await request({
    uri: config.chanify.uri,
    method: 'POST',
    json: true,
    body: params
  });
}

exports.sendNotice = sendNotice;
