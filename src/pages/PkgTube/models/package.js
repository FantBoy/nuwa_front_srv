import { queryPackage } from '@/services/api';

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
