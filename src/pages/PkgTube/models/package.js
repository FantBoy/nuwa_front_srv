import { queryPackage, delPackage, addPackage } from '@/services/api';

export default {
  namespace: 'pkg',

  state: {
    data: {
      pkg: [],
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
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addPackage, payload);
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
