/**
 * @Author: maple
 * @Date: 2021-01-21 15:32:31
 * @LastEditors: maple
 * @LastEditTime: 2021-01-21 15:58:55
 */
const needLoginPaths = [
  '/ddns',
  '/mock_data'
];

module.exports = async function (ctx, next) {
  const path = ctx.path;
  let needLogin = false;
  for (const needLoginPath of needLoginPaths) {
    if (path.indexOf(needLoginPath) === 0) {
      needLogin = true;
    }
  }

  if (needLogin && !ctx.session.user) {
    const err = new Error('need to login');
    err.code = 401;
    err.status = 401;
    throw err;
  }

  await next();
};
