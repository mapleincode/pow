/**
 * @Author: maple
 * @Date: 2021-01-18 10:25:09
 * @LastEditors: maple
 * @LastEditTime: 2021-04-07 10:37:29
 */
const cron = require('node-cron');
const ReposExpiresNotions = require('./scripts/repos/expires_notions');

ReposExpiresNotions.expires();

cron.schedule('*/10 9-23 * * *', () => {
  ReposExpiresNotions.expires();
});
