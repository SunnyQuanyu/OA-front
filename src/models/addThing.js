import http from '../utils/axios';

const initData = {
  title: '',
  content: '',
  hasSendFile: '0',
  needFinish: '0',
  needAnswer: '0',
  needFileReply: '0',
  startTime: null, // moment._d can be cast to Date
  endTime: null,
  tagId: null,
  userTeam: true,
  teamId: null,
  receiverIds: [],
  files: [],
  // fields before here shoule be upload
  showStepKeys: [1, 2, 3, 5],
  tags: [],
  teams: [],
  tagName: '',
  teamName: '',
  userSearchResult: null,
  questions: [], // should upload as json string
  currentIndex: 0
};

export default {
  namespace: 'addThing',

  state: initData,

  subscriptions: {
    setup({ dispatch, history }) {}
  },

  effects: {
    *getTags({ payload }, { call, put }) {
      console.log(123);
      const tagResult = yield call(() => {
        return http.post('/tag/tags');
      });
      yield put({
        type: 'save',
        payload: {
          tags: tagResult.data.data
        }
      });
    },
    *getTeams({ payload }, { call, put }) {
      const teamResult = yield call(() => {
        return http.post('/team/createdList');
      });
      yield put({
        type: 'save',
        payload: {
          teams: teamResult.data.data
        }
      });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    init() {
      return initData;
    }
  }
};
