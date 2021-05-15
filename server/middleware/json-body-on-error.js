/**
 * @Author: maple
 * @Date: 2021-01-20 11:01:38
 * @LastEditors: maple
 * @LastEditTime: 2021-01-21 21:00:23
 */

module.exports = {
  accepts: () => 'json',
  json: (err, ctx) => {
    // ctx.logger.error(err);
    ctx.status = err.status || 400;
    const code = err.code || -1;
    ctx.body = {
      success: false,
      code: code,
      message: err.message,
      data: {}
    };
  }
};
