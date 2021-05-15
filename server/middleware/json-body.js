/**
 * @Author: maple
 * @Date: 2021-01-20 11:00:34
 * @LastEditors: maple
 * @LastEditTime: 2021-01-25 11:49:37
 */
module.exports = async function (ctx, next) {
  const origin = ctx.req.headers.origin;
  if (origin &&
    (origin.indexOf('vmko.cc') > -1 || origin.indexOf('localhost') > -1)) {
    ctx.response.set({
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'POST, PUT, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    });
  }

  if (ctx.method === 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }

  if (ctx.response.is(['json', 'text']) && ctx.format !== false) {
    const body = ctx.body;
    let result;
    if (typeof body === 'string') {
      result = { msg: body };
    } else if (typeof body === 'object') {
      if (Array.isArray(body)) {
        result = { items: body };
      }
      result = body;
    } else {
      result = { data: body };
    }

    ctx.body = {
      code: 0,
      status: 200,
      message: 'success',
      data: result
    };
  }
};
