import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      module: {
        isLogin: false,
        userSeq: null,
        userId: null,
        userNick: null,
      }
    };
  },
  mutations: {
    changeIsLogin(state, payload) {
      state.module.isLogin = payload;
    },
    changeUserSeq(state, payload) {
      state.module.userSeq = payload;
    },
    changeUserId(state, payload) {
      state.module.userId = payload;
    },
    changeUserNick(state, payload) {
      state.module.userNick = payload;
    }
  }
});
