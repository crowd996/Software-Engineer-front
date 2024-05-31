import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import websocket from 'vue-native-websocket';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark, faFan, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

library.add(faXmark, faFan, faArrowUp, faArrowDown)

const user = localStorage.getItem('user');
if (user) {
    store.commit('setLogin', JSON.parse(user));
}

const app = createApp(App);

// app.use(websocket, '', {
//     connectManually: true, // 手动连接
//     format: 'json', // json格式
//     reconnection: true, // 是否自动重连
//     reconnectionAttempts: 5, // 自动重连次数
//     reconnectionDelay: 2000, // 重连间隔时间
// });

// load router
app.use(store);
app.use(router);
app.use(ElementPlus);
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app');
