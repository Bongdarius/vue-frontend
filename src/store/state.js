import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      module: {
        isLogin: false,
        loginId : null
      }
    };
  },
  mutations: {
    changeIsLogin(state, payload) {
      state.module.isLogin = payload;
    },
    changeLoginId(state, payload) {
      state.module.loginId = payload;
    }
  }
});
