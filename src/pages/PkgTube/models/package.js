import { queryPackage, delPackage } from '@/services/api';

export default {
  namespace: 'pkg',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPackage, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *del({ payload, callback }, { call, put }) {
      const response = yield call(delPackage, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
