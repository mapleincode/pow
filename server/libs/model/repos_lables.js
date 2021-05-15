/**
 * @Author: maple
 * @Date: 2021-01-19 16:49:11
 * @LastEditors: maple
 * @LastEditTime: 2021-01-19 18:11:38
 */
const DB = require('../db');
const mysql = DB.get('arku');
const moment = require('moment');

const ReposLabels = mysql.qdefine('repos_labels', [
  'id, i',
  'status, i, 0',
  'label, s',
  'count, i',
  'updatedAt, d',
  'createdAt, d'
]);

ReposLabels.label = async function (label) {
  if (!label) {
    return;
  }

  let item = await this.where({ label: label }).findOne();
  if (!item) {
    item = this.build({
      status: 0,
      label,
      count: 0,
      createdAt: moment()
    });
  }

  if (item.count > 5) {
    item.status = 1;
  }
  item.count = item.count + 1;
  item.updatedAt = moment();
  return await item.save();
};

ReposLabels.getLabels = async function () {
  const list = await this.where({ status: 1 }).limit([0, 20]).order('count desc').find();
  return list.map(item => item.label);
};
