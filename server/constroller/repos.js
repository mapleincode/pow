/**
 * @Author: maple
 * @Date: 2021-01-07 15:06:49
 * @LastEditors: maple
 * @LastEditTime: 2021-01-20 13:45:25
 */
const modelGet = require('../libs/db').modelGet;
// const _ = require('lodash');

const repos = modelGet('repos');
const reposLabels = modelGet('repos_labels');

module.exports = {
  list: async (ctx) => {
    const userId = ctx.query.userId || 1;
    const page = parseInt(ctx.query.page);
    const pageSize = parseInt(ctx.query.pageSize);
    const keyword = ctx.query.keyword;
    const sort = ctx.query.sort;
    let desc = ctx.query.desc;

    if (desc) {
      desc = desc.toLowerCase();
      if (desc !== 'asc' && desc !== 'desc') {
        desc = null;
      }
    }
    const options = { userId, keyword, sort, desc };

    const [list, labels] = await Promise.all([
      repos.list(page, pageSize, options),
      reposLabels.getLabels()
    ]);

    ctx.body = {
      items: list,
      labels
    };
  },
  create: async (ctx) => {
    const req = ctx.request;
    const userId = req.body.userId || 1;
    const name = req.body.name;
    const count = req.body.count;
    const countUnix = req.body.countUnix;
    const expirationDate = req.body.expirationDate;
    const boughtDate = req.body.boughtDate;
    const productionDate = req.body.productionDate;
    const remark = req.body.remark;
    const expirationTimeUnix = req.body.expirationTimeUnix;
    const expirationTimeValue = req.body.expirationTimeValue;
    let labels = req.body.labels;
    if (labels && typeof labels === 'string') {
      labels = JSON.parse(labels);
    }

    const data = {
      userId,
      name,
      count,
      countUnix,
      expirationDate,
      boughtDate,
      productionDate,
      expirationTimeUnix,
      expirationTimeValue,
      remark,
      labels
    };

    if (Array.isArray(labels) && labels.length) {
      await Promise.all(labels.map(async item => reposLabels.label(item)));
    }

    await repos.createItem(data);
    ctx.body = {};
  },

  delete: async (ctx) => {
    const id = ctx.query.id;
    const data = await repos.findById(id || -1);
    if (!id || !data) {
      throw new Error('id 无效');
    }
    data.deleteStatus = 1;
    await data.save();
    ctx.body = {};
  },

  modify: async (ctx) => {
    const id = ctx.request.body.id;
    const name = ctx.request.body.name;
    const remark = ctx.request.body.remark;
    const count = ctx.request.body.count;
    const data = await repos.findById(id || -1);

    let labels = ctx.request.body.labels;
    if (labels && typeof labels === 'string') {
      labels = JSON.parse(labels);
    }
    if (!id || !data) {
      throw new Error('id 无效');
    }

    if (typeof name === 'string' && name.trim()) {
      data.name = name.trim();
    }

    if (typeof remark === 'string') {
      data.remark = remark;
    }

    if (count && count > 0) {
      data.count = count;
    }

    if (labels && labels.length) {
      data.labels = JSON.stringify(labels);
    }

    await data.save();
    ctx.body = {};
  },

  search: async (ctx) => {
    const userId = ctx.query.userId || 1;
    const page = parseInt(ctx.query.page);
    const pageSize = parseInt(ctx.query.pageSize);
    const keyword = ctx.query.keyword;
    const sort = ctx.query.sort;
    let desc = ctx.query.desc;

    if (desc) {
      desc = desc.toLowerCase();
      if (desc !== 'asc' && desc !== 'desc') {
        desc = null;
      }
    }
    const options = { userId, keyword, sort, desc };

    const list = await repos.list(page, pageSize, options);
    ctx.body = {
      items: list
    };
  }
};
