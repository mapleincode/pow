/**
 * @Author: maple
 * @Date: 2021-01-07 17:55:36
 * @LastEditors: maple
 * @LastEditTime: 2021-01-20 17:06:55
 */
import { fetch, create, deleteItem, modifyItem } from '@/services/repo/index'
// import { ConsoleSqlOutlined } from '@ant-design/icons'

const repo = {
  namespace: 'repo',
  state: {
    items: [],
    repoItem: {
      name: '',
      count: 1,
      countUnix: '个',
      productionDate: null,
      expirationDate: null,
      date: null,
      dateType: 'production', // expiration
      expirationTimeUnix: '年',
      expirationTimeValue: null,
      boughtDate: null,
      remark: '',
      labels: []
    },
    keyword: '',
    defaultLabels: null
  },
  reducers: {
    updateList(state, { payload: { items, labels } }) {
      const newState = {
        ...state,
        items
      }
      if (state.defaultLabels && state.defaultLabels.join(',') === labels.join(',')) {
        return newState;
      }
      newState.defaultLabels = labels;
      return newState;
    },
    setRepoItem(state, { payload }) {
      payload = payload || {}
      return {
        ...state,
        repoItem: {
          ...state.repoItem,
          ...payload
        }
      }
    },
    handleKeywordChange(state, { payload = {} }) {
      const keyword = payload.keyword;
      return {
        ...state,
        keyword
      }
    }
  },
  effects: {
    * fetch(payload, { call, put }) {
      const data = yield call(fetch, {
        ...payload.payload
      })
      yield put({ type: 'updateList', payload: data })
    },
    * create(payload, { call }) {
      yield call(create, payload.payload);
    },

    * delete({ payload }, { call, put }) {
      yield call(deleteItem, payload);
      yield repo.effects.fetch({}, { call, put });
    },

    * modify({ payload = {} }, { call, put }) {
      yield call(modifyItem, payload);
      yield repo.effects.fetch({}, { call, put });
    }
  },
  subscriptions: {
    render({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/') {
          dispatch({ type: 'fetch' });
        }
      });
    }
  }
}


export default repo;