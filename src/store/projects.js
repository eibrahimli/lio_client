import axios from "../api/axios";

export default {
    state: {
        project: [],
    },
    getters: {
        project(state) {
            return state.project
        }
    },
    mutations: {
        SET_SINGLE_PROJECT(state,project) {
            state.project = project
        }
    },

    actions: {

        async getSingleProjectFromApi({commit}, id) {
            let response = await axios.get(`/project/${id}`)

            commit('SET_SINGLE_PROJECT', response.data.data)
        },
        async disAssociateStatusFromProject(_, data) {

            let response = await axios.delete(`/project/${data.project_id}/status/${data.status_id}`)

            return response.data
        },
        async storeProject(_,data) {
            let response = await axios.post(`/project`, {name: data.name, department: data.department_id})
            if(response.data.message === 'success') {
                return response.data.data
            }
        },
        async removeProjectFromApi(_,id) {
            let response = await axios.delete('/project/'+id)

            return response.data.message
        }
    }
}