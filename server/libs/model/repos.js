/**
 * @Author: maple
 * @Date: 2021-01-05 10:27:02
 * @LastEditors: maple
 * @LastEditTime: 2021-01-19 17:08:56
 */
const moment = require('moment');
const DB = require('../db');
const mysql = DB.get('arku');

const Repos = mysql.qdefine('repos', [
  'id, i',
  'name, s',
  'userId, i',
  'count, i, 1',
  'countUnix, s, 个',
  'expirationDate, d',
  'expirationTime, i, $t',
  'expirationTimeUnix, s, $t',
  'expirationTimeUnixCode, i, 0',
  'expirationTimeValue, s, $t',
  'productionDate, d, $t',
  'boughtDate, d, $t',
  'remark, t, $t',
  'labels, t, $t',
  'deleteStatus, i, 0',
  'createdAt, d',
  'updatedAt, d'
]);

Repos.Unix = {
  None: 0,
  Year: 1,
  Month: 2,
  Day: 3
};

Repos.formatUnixCode = function (unix) {
  if (parseInt(unix) >= 0 && parseInt(unix) <= 3) {
    return parseInt(unix);
  }

  if (unix === null || unix === undefined) {
    return this.Unix.None;
  }

  if (unix === '年' || unix === 'year' || unix === 'years') {
    return this.Unix.Year;
  }

  if (unix === '月' || unix === 'month' || unix === 'months') {
    return this.Unix.Month;
  }

  if (unix === '天' || unix === 'day' || unix === 'days') {
    return this.Unix.Day;
  }
  throw new Error('暂不支持的时间单位: ' + unix);
};

Repos.computeExpirationTime = function (value, unixCode) {
  if (value < 0) {
    value = 0;
  }
  if (unixCode === this.Unix.Year) {
    return 31536000 * value;
  }

  if (unixCode === this.Unix.Month) {
    return 2592000 * value;
  }

  if (unixCode === this.Unix.Day) {
    return 86400 * value;
  }

  throw new Error('暂不支持的时间单位: ' + unixCode);
};

/**
 * 根据生产日期 & 保质期计算过期时间
 */
Repos.computeExpirationDate = function (productionDate, value, unixCode) {
  const expirationDate = moment(productionDate);
  if (unixCode === this.Unix.Year) {
    expirationDate.add(value, 'y');
  } else if (unixCode === this.Unix.Month) {
    expirationDate.add(value, 'M');
  } else if (unixCode === this.Unix.Day) {
    expirationDate.add(value, 'd');
  }
  return expirationDate;
};

Repos.computeProductionDate = function (expirationDate, value, unixCode) {
  if (!value || !unixCode) {
    return null;
  }
  const productionDate = moment(expirationDate);
  if (unixCode === this.Unix.Year) {
    productionDate.add(-value, 'y');
  } else if (unixCode === this.Unix.Month) {
    productionDate.add(-value, 'M');
  } else if (unixCode === this.Unix.Day) {
    productionDate.add(-value, 'd');
  }
  return productionDate;
};
Repos.formatDateToMoment = function (items) {
  const list = [].concat(items);
  const results = [];

  for (const item of list) {
    if (item.expirationDate) {
      item.expirationDate = moment(item.expirationDate);
    }

    if (item.productionDate) {
      item.productionDate = moment(item.productionDate);
    }

    if (item.boughtDate) {
      item.boughtDate = moment(item.boughtDate);
    }
    results.push(item);
  }

  if (Array.isArray(items)) {
    return results;
  }

  return results[0];
};
Repos.formatDateToUnix = function (items) {
  const list = [].concat(items);
  const results = [];

  for (const data of list) {
    // const data = item.toJSON();
    if (data.expirationDate) {
      data.expirationDate = data.expirationDate.unix();
    }

    if (data.productionDate) {
      data.productionDate = data.productionDate.unix();
    }

    if (data.boughtDate) {
      data.boughtDate = data.boughtDate.unix();
    }
    results.push(data);
  }

  if (Array.isArray(items)) {
    return results;
  }

  return results[0];
};

Repos.otherInfo = function (data) {
  if (data.labels && typeof data.labels === 'string') {
    data.labels = JSON.parse(data.labels);
  }

  const { productionDate, expirationDate } = data;
  let productionDateUnix = 0;
  if (productionDate) {
    productionDateUnix = productionDate.unix();
  }

  const expirationDateUnix = expirationDate.unix();

  const result = {
    isExpire: 1, // 过期状态 1 正常 2 临期 3 已过期
    freshDegree: -1, // -1 过期
    freshDegreeText: -1, // -1 过期
    adventDateText: '' // 剩余期限
  };
  const now = moment().unix();
  const diffNow = expirationDateUnix - now;
  const diffAll = expirationDateUnix - productionDateUnix;
  const tmpFreshDegree = productionDate
    ? (parseFloat(diffNow / diffAll) * 100).toFixed(2)
    : 100;

  if (diffNow <= 0) {
    // 已过期
    result.isExpire = 3;
    result.freshDegree = -1;
    result.freshDegreeText = '已过期';
    result.adventDateCount = -1;
    result.adventDateUnix = '';
    result.adventDateText = '-';
    result.adventTime = 0;
    result.adventDays = 0;
    return Object.assign({}, data, result);
  }
  // 保鲜度
  result.freshDegree = tmpFreshDegree;
  result.freshDegreeText = `${tmpFreshDegree}%`;

  // 计算临保天数
  const adventDays = parseInt(diffNow / 3600 / 24);
  result.adventTime = diffNow;
  result.adventDays = adventDays;
  if (adventDays === 0) {
    result.adventDateCount = parseInt(diffNow / 3600);
    result.adventDateUnix = '小时';
    result.adventDateText = `${result.adventDateCount}小时`;
  } else if (adventDays > 365) {
    const yearText = parseInt(adventDays / 365);
    const redundantDays = adventDays % 365;
    let redundantMonth = 0;
    if (redundantDays > 30) {
      redundantMonth = parseInt(redundantDays / 30);
    }
    result.adventDateCount = yearText;
    result.adventDateUnix = '年';
    result.adventDateText = `${result.adventDateCount}年`;
    if (redundantMonth) {
      result.adventDateText = result.adventDateText + redundantMonth + '个月';
    }
  } else if (adventDays > 30) {
    result.adventDateCount = parseInt(adventDays / 30);
    result.adventDateUnix = '个月';
    result.adventDateText = `${result.adventDateCount}个月`;
  } else {
    result.adventDateCount = adventDays;
    result.adventDateUnix = '天';
    result.adventDateText = `${adventDays} 天`;
  }

  // 临期状态计算
  // 保鲜度 < 10%
  // 保质期还剩 2 天
  if (tmpFreshDegree < 10 || adventDays <= 2) {
    result.isExpire = 2;
  }

  return Object.assign({}, data, result);
};

Repos.list = async function (page, pageSize, options = {}) {
  const { userId, sort, desc = 'asc', keyword } = options;

  const condition = {
    userId: userId,
    deleteStatus: 0
  };

  if (keyword) {
    condition.$or = {
      name: {
        $like: `%${keyword}%`
      },
      remark: {
        $like: `%${keyword}%`
      },
      labels: {
        $like: `%${keyword}%`
      }
    };
  }

  let query = this.where(condition);
  if (page && pageSize) {
    const start = (page - 1) * pageSize;
    const limit = parseInt(pageSize);
    query = query.limit([start, limit]);
  }

  if (sort) {
    query = query.sortBy(`${sort} ${desc}`);
  }

  const items = (await query.find()).map(item => item.toJSON());
  const list = this.formatDateToUnix(
    this.formatDateToMoment(items).map(item => this.otherInfo(item)));

  return list.sort((a, b) => {
    return a.adventTime - b.adventTime;
  });
};

Repos.createItem = async function (data = {}) {
  let {
    userId,
    name,
    count = 1,
    countUnix = '个',
    expirationDate = null,
    expirationTimeUnix = null,
    expirationTimeValue = null,
    productionDate = null,
    remark = '',
    boughtDate = null,
    labels
  } = data;

  if (!userId) {
    throw new Error('缺失 userId');
  }

  if (!name) {
    throw new Error('name 缺失');
  }

  if (!expirationDate) {
    // 没有到期时间
    if (!expirationTimeUnix) {
      throw new Error('缺失 expirationTimeUnix');
    }
    if (!expirationTimeValue) {
      throw new Error('缺失 expirationTimeValue');
    }
    if (!productionDate) {
      throw new Error('缺失 productionDate');
    }
  }

  // 过期时间计算
  // 前提是有过期单位和数值
  let expirationTimeUnixCode = 0;
  let expirationTime = null;
  if (expirationTimeUnix && expirationTimeValue) {
    expirationTimeUnixCode = this.formatUnixCode(expirationTimeUnix);
    expirationTime = this.computeExpirationTime(expirationTimeValue, expirationTimeUnixCode);
  } else {
    expirationTimeUnix = null;
    expirationTimeValue = null;
  }

  // 根据保质期 & 生产日期推算过期时期
  if (expirationTime && productionDate && !expirationDate) {
    expirationDate = this.computeExpirationDate(productionDate, expirationTimeValue, expirationTimeUnixCode);
  }

  // 根据保质期 & 过期日期推算生产日期
  if (expirationTime && !productionDate && expirationDate) {
    productionDate = this.computeProductionDate(expirationDate, expirationTimeValue, expirationTimeUnixCode);
  }

  const now = moment();

  const dbData = {
    userId,
    name,
    count,
    countUnix,
    expirationDate,
    expirationTimeUnix,
    expirationTimeUnixCode,
    expirationTime,
    expirationTimeValue,
    productionDate,
    boughtDate,
    remark,
    labels: Array.isArray(labels) && labels.length ? JSON.stringify(labels) : null,
    createdAt: now,
    updatedAt: now
  };

  await this.build(dbData).save();
};

// const data = {
//   userId: 1,
//   name: '林檎',
//   count: 20,
//   countUnix: '头',
//   expirationDate: '2021-10-05 18:52:47',
//   // expirationTimeUnix: '年',
//   // expirationTimeValue: 1,
//   // productionDate: '2020-07-05 18:54:22',
//   boughtDate: '2021-01-05 18:55:30',
//   remark: 'test'
// };

// Repos.create(data);

module.exports = Repos;
