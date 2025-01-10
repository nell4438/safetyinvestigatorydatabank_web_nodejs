import Vue from 'vue'
import Vuex from 'vuex'
import  createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
// Vue.use(persistedstate)

export default new Vuex.Store({
  plugins: [
    createPersistedState()
  ],
  state: {
    SIdatabank_userInfo:{},
    isLogin: false,
    searching:'',
    emplcode: '',
    navDrawerVal: false,
    isConnect: true,
  },
  
  mutations: {
    CHANGE_USER_INFO: (state,data)=>{
      state.SIdatabank_userInfo = data
    },
    CHANGE_USER_LOGGING: (state, data) => {
      state.isLogin = data
    },
    CHANGE_SEARCH:(state,data)=>{
      state.searching=data
    },
   
    CHANGE_EMPLCODE: (state, data) => {
      state.emplcode = data
    },
    CHANGE_NAVDRAWER: (state, data) => {
      state.navDrawerVal = data
    },
    CHANGE_CONNECTION: (state, data) => {
      state.isConnect = data
    },
  },
  actions: {
  },
  modules: {
  }
})
