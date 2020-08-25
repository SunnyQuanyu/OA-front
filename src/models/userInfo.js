export default {
  namespace: 'userInfo',

  state: {
    // TODO 改回来到时候
    isLogined: false,
    info: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, info: action.data, isLogined: action.isLogined };
    },
  },
};
