/**
 * @Author: maple
 * @Date: 2020-05-12 11:25:11
 * @LastEditors: maple
 * @LastEditTime: 2021-02-01 09:47:17
 */
import fetch from 'dva/fetch';
import { message } from 'antd';
import router from 'umi/router';


function parseJSON(response) {
  return response.json();
}

// function checkStatus(response) {
//   if (response.status >= 200 && response.status < 300) {
//     return response;
//   }

//   const error = new Error(response.statusText);
//   error.response = response;
//   throw error;
// }

// function checkCode(data) {
//   if(data && data.code === 0) {
//     return data.data;
//   }
//   throw new Error(data.msg);
// }


/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  try {
    const response = await fetch(url, options)
  
    // 检查 http-status
    // await checkStatus(response);
    const jsonBody = await parseJSON(response);

    if (jsonBody.code !== 0 && response.status !== 200) {
      if (response.status === 401) {
        if (jsonBody.message !== '密码错误') {
          router.push('/user/login');
          return;
        }
      }

      const errorMsg = jsonBody.message || '未知错误'
      message.error(errorMsg);
      throw new Error(errorMsg);
    }
    return jsonBody.data;
  } catch(err) {
    return  { err }
    // return { err };
  }
}
