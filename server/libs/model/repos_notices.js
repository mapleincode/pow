/**
 * @Author: maple
 * @Date: 2021-01-18 11:11:00
 * @LastEditors: maple
 * @LastEditTime: 2021-05-15 19:17:56
 */
const DB = require('../db');
const mysql = DB.get('arku');
const moment = require('moment');
const dtRobot = require('../../libs/dtRobot');
const chanify = require('../../libs/chanify');
// const imessage = require('../../libs/imessage');

const ReposNotices = mysql.qdefine('repos_notices', [
  'id, i',
  'status, i, 0',
  'msg, s',
  'at, s, $t',
  'level, i',
  'repoId, i',
  'createdAt, d'
]);

ReposNotices.addNotion = async function (options = {}) {
  const {
    level,
    data,
    title,
    markdown,
    text,
    ats = [],
    // phone,
    chanifyTokens = []
  } = options;
  const notionStatus = await this.checkNotice(level, data);
  if (notionStatus) {
    return;
  }
  await this.build({
    status: 0,
    msg: markdown,
    at: ats.join(','),
    level,
    repoId: data.id,
    createdAt: moment()
  }).save();

  const message = dtRobot.createMarkdownMessage();
  message.setMobiles(ats);
  message.setMarkdown(markdown);
  message.setTitle(title);
  await message.send();

  if (chanifyTokens && chanifyTokens.length) {
    for (const token of chanifyTokens) {
      await chanify.sendNotice(token, text, title);
    }
  }
  // if (phone) {
  //   await imessage.sendNotice(phone, text, title);
  // }

  const readItem = await this.where({ level, repoId: data.id }).findOne();
  readItem.status = 1;
  await readItem.save();
};

ReposNotices.checkNotice = async function (level, data) {
  const repoId = data.id;
  const count = await this.where({ repoId, level }).count();
  return !!count;
};

module.exports = ReposNotices;
