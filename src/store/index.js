import { createStore } from 'vuex';
import EventBus from '../eventBus';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
    state: {
        isLoggedIn: false,
        user: "null",
        token: "null",
        socket1: null,
        socket2: null,
    },
    mutations: {
        login(state, { user, token }) {
            state.isLoggedIn = true;
            state.user = user;
            state.token = token;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.user = "null";
            state.token = "null";
            if (state.socket1) {
                state.socket1.close();
                state.socket1 = null;
            }
            if (state.socket2) {
                state.socket2.close();
                state.socket2 = null;
            }
        },
        setLogin(state, user, token) {
            state.isLoggedIn = true;
            state.user = user;
            state.token = token;
        },
        SET_SOCKET1(state, socket) {
            state.socket1 = socket;
        },
        SET_SOCKET2(state, socket) {
            state.socket2 = socket;
        }
    },
    actions: {
        login({ commit }, { user, token }) {
            commit('login', { user, token });
        },
        logout({ commit }) {
            commit('logout');
        },
        initSocket1({ state, commit, dispatch }, baseUrl) {
            const url = `${baseUrl}?Authorization=Bearer ${encodeURIComponent(state.token)}`;
            const socket = new WebSocket(url);
            socket.onmessage = (event) => {
                dispatch('handleMessageFromSocket1', event.data);
            };
            // socket.onopen = () => {
            //     // 每30秒发送一次心跳包
            //     state.socket1Heartbeat = setInterval(() => {
            //         socket.send(JSON.stringify({ type: 'ping' }));
            //     }, 30000);
            // };
            // socket.onclose = () => {
            //     clearInterval(state.socket1Heartbeat);
            // };
            commit('SET_SOCKET1', socket);
        },
        initSocket2({ state, commit, dispatch }, baseUrl) {
            const url = `${baseUrl}?Authorization=Bearer ${encodeURIComponent(state.token)}`;
            const socket = new WebSocket(url);
            socket.onmessage = (event) => {
                dispatch('handleMessageFromSocket2', event.data);
            };
            // socket.onopen = () => {
            //     // 每30秒发送一次心跳包
            //     state.socket1Heartbeat = setInterval(() => {
            //         socket.send(JSON.stringify({ type: 'ping' }));
            //     }, 30000);
            // };
            // socket.onclose = () => {
            //     clearInterval(state.socket1Heartbeat);
            // };
            commit('SET_SOCKET2', socket);
        },
        closeSocket1({ state, commit, dispatch }) {
            state.socket1.close();
            console.log("close");
            this.socket1 = null;
        },
        closeSocket2({ state, commit, dispatch }) {
            state.socket2.close();
            console.log("close");
            this.socket2 = null;
        },
        handleMessageFromSocket1({ commit }, message) {
            // 触发事件总线事件
            const parsedMessage = JSON.parse(message);
            EventBus.$emit('socket1-message', parsedMessage);
        },
        handleMessageFromSocket2({ commit }, message) {
            // 触发事件总线事件
            const parsedMessage = JSON.parse(message);
            EventBus.$emit('socket2-message', parsedMessage);
        },
        sendMessageToSocket1({ state }, message) {
            if (state.socket1) {
                const messageWithToken = JSON.stringify(
                    message
                );
                state.socket1.send(messageWithToken);
            }
        },
        sendMessageToSocket2({ state }, message) {
            if (state.socket2) {
                const messageWithToken = JSON.stringify({
                    data: message
                });
                state.socket2.send(messageWithToken);
            }
        },
    },
    getters: {
        getToken(state) {
            return state.token
        },
        isLoggedIn: state => state.isLoggedIn,
        messagesFromSocket1: state => state.messagesFromSocket1,
        messagesFromSocket2: state => state.messagesFromSocket2,
    },
    plugins: [
        createPersistedState({
            key: 'my-app-state', // 用于本地存储中的键
            paths: ['token', 'isLoggedIn', 'user'],   // 要持久化的 state 的路径
            storage: window.sessionStorage, // 使用 localStorage 进行持久化
        })
    ],
});
