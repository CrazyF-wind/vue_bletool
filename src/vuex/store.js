/**
 * Created by Administrator on 2017/7/17.
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  username: {}
}

const mutations = {
  isLogin (state, user) {
    state.username = user
  }
}

export default new Vuex.Store({
  state,
  mutations
})
