import axios from "../api/axios";


export default {
    state: {
        task: null,
        comments: null,
        comment: null,
    },
    getters: {
        task(state) {
            return state.task
        },
        comments(state) {
            return state.comments
        },
        getComment(state) {
            return state.comment
        }
    },

    actions: {
        async storeTask({commit}, data) {
            let response = await axios.post('/task', data)

            commit('SET_TASK', response.data)
        },
        async changeTaskStatus({commit}, data) {
            let response = await axios.put(`/task/${data.id}`, data)

            if(response.data.message === 'success') {
                commit('SET_TASK', response.data.data)
            }
        },
        async getCommentsFromApi({commit}, task_id) {
            let response = await axios.get('/task/'+task_id+'/comments')

            if(response.data.message === 'success') {
                commit('SET_COMMENTS',response.data.data)
            }
        },
        async addCommentToApi({commit}, data) {
            let response = await axios.post('/task/'+data.task_id+'/comments',{ text: data.text })

            if(response.data.message === 'success') {
                commit('SET_COMMENT', response.data.data)
            }
        },
        async removeTaskFromApi(_,task) {
            let response = await axios.delete('/task/'+task.id)

            if(response.data.message === 'success') {
                return true
            }
        },
        async assignTaskToEmployee(_,task) {
            let response = await axios.patch(`/task/${task.id}`, {name: task.name, assigned_to: task.assigned_to})

            if(response.data.message === 'success') {
                return true
            }
        },
        async updateTask(_,task) {
            let response = await axios.patch(`/task/${task.id}`,{completed: task.completed, name: task.name, text: task.text, deadline: task.deadline  })

            if(response.data.message === 'success') {
                return response.data.data
            }
        },
        async filterAssignedTasks(_,field) {
            let response = await axios.get('/task/filter/'+field)

            if(response.data.message === 'success') {
                return response.data.data
            }
        }
    },
    mutations: {
        SET_TASK(state,data) {
            state.task = data
        },
        SET_COMMENTS(state,data) {
            state.comments = data
        },
        SET_COMMENT(state,comment) {
            state.comment = comment
        }
    }
}