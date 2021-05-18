import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import projects from './projects'
import tasks from './tasks'
import statuses from './statuses'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,projects,tasks,statuses
  }
})
