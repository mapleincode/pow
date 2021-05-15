/**
 * @Author: maple
 * @Date: 2020-12-04 16:34:06
 * @LastEditors: maple
 * @LastEditTime: 2020-12-04 16:41:41
 */
module.exports = function (time) {
  return new Promise(function (resolve) {
    setTimeout(() => {
      resolve();
    }, parseInt(time * 1000));
  });
};
