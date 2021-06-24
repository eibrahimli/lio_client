import axios from '../api/axios'

export default {
    state: {
        status: {},
    },
    getters: {
      status(state) {
          return state.status
      }
    },
    actions: {
        async storeStatus({commit}, data) {
            let response = await axios.post('/status',data)

            if(response.data.message === 'success') {
                commit('SET_STATUS', response.data.status)
            }
        },
        async updateStatus(_,data) {
            let response = await axios.patch(`/status/${data.id}`,{
                name: data.name,
                project_id: data.project_id,
                color: data.color
            })

            if(response.data.message === 'success') {
                return response.data
            }
        }
    },

    mutations: {
        SET_STATUS(state,data) {
            state.status = data
        }
    }
}