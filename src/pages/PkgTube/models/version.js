import { queryVersions } from "@/services/api";

export default {
  namespace: "version",

  state: {
    data: {
      list: [],
      pagination: {}
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryVersions, payload);
      yield put({
        type: "save",
        payload: response
      });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    }
  }
};
