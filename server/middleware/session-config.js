/**
 * @Author: maple
 * @Date: 2021-01-20 11:04:28
 * @LastEditors: maple
 * @LastEditTime: 2021-01-21 20:38:20
 */
const CONFIG = {
  key: 'koa.sess', /** (string) cookie key (default is koa.sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  domain: '.vmko.cc',
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: true, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false) */
  secure: false, /** (boolean) secure cookie */
  sameSite: null /** (string) session cookie sameSite options (default null, don't set it) */
};

// CONFIG.store = {
//   get: async function (key, maxAge, { rolling, ctx }) {

//   },
//   set: function (key, sess, maxAge, { rolling, changed, ctx }) {

//   },
//   destroy: function (key, { ctx }) {

//   }
// };

module.exports = CONFIG;
