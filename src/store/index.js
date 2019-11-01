import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        updateData: {
            finish: false,
            date: ''
        }
    },
    mutations: {
        setUpdateData(state, data) {
            state.updateData = data
        }
    },
    modules: {},
    plugins: [
        createPersistedState({
            storage: window.localStorage
        })
    ]
})
