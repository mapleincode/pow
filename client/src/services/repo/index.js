/**
 * @Author: maple
 * @Date: 2021-01-07 17:25:28
 * @LastEditors: maple
 * @LastEditTime: 2021-01-15 16:14:30
 */
import request from '@/utils/request';
import config from '@/config';
import querystring from 'querystring';

export function fetch(params = {}) {
  const { sort, desc, keyword } = params

  let url = `${config.arkuHost}/repo/list`;
  if (sort || desc || keyword) {
    url = `${url}?${querystring.stringify({ sort, desc, keyword })}`
  }
  return request(url)
}

export function create(data = {}) {
  const url = `${config.arkuHost}/repo/item`;
  return request(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

export function deleteItem(data = {}) {
  const { id } = data;
  const url = `${config.arkuHost}/repo/item?id=${id}`;
  return request(url, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
  })
}

export function modifyItem(data = {}) {
  const url = `${config.arkuHost}/repo/item`;
  return request(url, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}