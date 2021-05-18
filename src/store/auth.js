import axios from "../api/axios";

export default {
  namespaced: true,

  state: {
    token: null,
    user: null,
    projects: null,
    department: null
  },

  getters: {
    authenticated(state) {
      return state.user && state.token ? true : false
    },

    user(state) {
      return state.user
    },
    projects(state) {
      return state.projects
    },
    department(state) {
      return state.department
    }
  },

  actions: {
    async getToken({ dispatch }, data) {
      let response = await axios.post('employee/login', data)

      return dispatch('attempt', response.data.access_token)
    },

    async attempt({commit , state},token) {
      
      if(token) {
        commit('SET_TOKEN', token)
      }

      if(!state.token) {
        return 
      }
      
      try {

        let response = await axios.post('employee/me')
        if(response.data.message) {
          commit('SET_TOKEN', null)
          commit('SET_USER', null)
        }
        commit('SET_USER', response.data)
      } catch(e) {
        commit('SET_TOKEN', null)
        commit('SET_USER', null)
      }

    },

    async getDepartment({commit,state}) {

      let response = await axios.get('/department/'+state.user.department_id)

      if(response.data.message === 'success') {
        commit('SET_DEPARTMENT', response.data)
      }
    },

    async signOut({ commit }) {
      return await axios.post('/employee/logout').then(() => {
        commit('SET_TOKEN', null)
        commit('SET_USER', null)
      })
    }

  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_DEPARTMENT(state,response) {
      state.department = response.data
      state.projects = response.data.projects
    }
  }

}