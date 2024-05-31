import { createStore } from 'vuex';

export default createStore({
    state: {
        isLoggedIn: false,
        user: "null",
        token: "null"
    },
    mutations: {
        login(state) {
            state.isLoggedIn = true;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.user = "null";
            state.token = "null"
        },
        setLogin(state, user, token) {
            state.isLoggedIn = true;
            state.user = user; // 假设你想存储用户信息
            state.token = token;
        },
    },
    actions: {
        login({ commit }) {
            commit('login');
        },
        logout({ commit }) {
            commit('logout');
        }
    },
    getters: {
        isLoggedIn: state => state.isLoggedIn
    }
});