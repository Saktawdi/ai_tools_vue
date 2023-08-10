import { createStore } from 'vuex'
import defaultHeadImg from "@/assets/default5.png";

export default createStore({
  state: {
    token: localStorage.getItem('token') || "",
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {
      avatar:defaultHeadImg,
      userName:"游客",
      dept:{
        deptName:"游客"
      }},
  },
  getters: {
    getToken(state) {
      return state.token;
    },
    getUserInfo(state) {
      return state.userInfo;
    }
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    SET_USERINFO(state, userInfo) {
      state.userInfo = userInfo;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    },
    CLEAR_TOKEN(state) {
      state.token = "";
      localStorage.removeItem('token');
    },
    CLEAR_USERINFO(state) {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    }
  },
  actions: {
    setToken(context, token) {
      context.commit("SET_TOKEN", token);
    },
    clearToken(context) {
      context.commit("CLEAR_TOKEN");
    },
    setUserInfo(context, userInfo) {
      context.commit("SET_USERINFO", userInfo);
    },
    clearUserInfo(context) {
      context.commit("CLEAR_USERINFO");
    }
  },
  modules: {}
})
