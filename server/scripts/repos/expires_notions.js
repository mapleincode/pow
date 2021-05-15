/**
 * @Author: maple
 * @Date: 2021-01-18 11:02:35
 * @LastEditors: maple
 * @LastEditTime: 2021-04-20 16:02:54
 */
const modelGet = require('../../libs/db').modelGet;
const moment = require('moment');
const Repos = modelGet('repos');
const Users = modelGet('users');
const ReposNotices = modelGet('repos_notices');

async function notices (data, level) {
  const checkStatus = await ReposNotices.checkNotice(level, data);
  if (checkStatus) return; // 已经发送过 notice

  const userId = data.userId;
  const user = await Users.findById(userId);
  if (!user) {
    throw new Error(`用户 id ${userId} 不存在!`);
  }
  let title = '';
  let markdown = `尊敬的${user.name}@${user.dt}:\n --- \n 您的物品: <${data.name}>`;
  let text = `尊敬的${user.name}:\n您的物品: <${data.name}>`;
  switch (level) {
  case 0:
    title = '物品过期通知';
    markdown = markdown + '已经过期！';
    text = text + '已经过期！';
    break;
  case 1:
  case 2:
  case 3:
    title = '物品临期通知';
    markdown = markdown + `距离过期还剩下 ${data.adventDateText}，请尽快处理!`;
    text = text + `距离过期还剩下 ${data.adventDateText}，请尽快处理!`;
    break;
  default:
    throw new Error('暂不支持的 level');
  }

  markdown = `${markdown}
> 数量: ${data.count} ${data.countUnix}

> 备注: ${data.remark}

> 过期时间: ${moment(data.expirationDate).format('YYYY-MM-DD')}


Date: ${moment().format('M-D')}
`;
  text = `${text}
数量: ${data.count} ${data.countUnix}
备注: ${data.remark}
过期时间: ${moment(data.expirationDate).format('YYYY-MM-DD')}

Date: ${moment().format('M-D')}
`;
  await ReposNotices.addNotion({
    level,
    data,
    title,
    text,
    markdown,
    ats: [user.dt],
    phone: user.dt,
    chanifyTokens: user.chanifyTokens ? JSON.parse(user.chanifyTokens) : []
  });
}

async function expires () {
  const items = await Repos.where({ deleteStatus: 0 }).find();

  for (const item of items) {
    const data = item.toJSON();
    const total = Repos.otherInfo(Repos.formatDateToMoment(data));

    const freshDegree = parseFloat(total.freshDegree);
    const adventTime = total.adventTime;

    const monthMs = 3600 * 24 * 30;
    // level 0 过期

    if (adventTime === 0) {
      await notices(total, 0);
      continue;
    }

    // 小于一个月 无论新鲜度强制提醒
    if (adventTime < monthMs) {
      await notices(total, 1);
      continue;
    }

    if (adventTime < monthMs * 3 && freshDegree < 50) {
      await notices(total, 2);
      continue;
    }

    if (adventTime < monthMs * 5 && freshDegree < 50) {
      await notices(total, 3);
      continue;
    }

    // level 1 临期
  }
}

exports.expires = expires;
