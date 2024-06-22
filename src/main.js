import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark, faFan, faArrowUp, faArrowDown, faGear } from '@fortawesome/free-solid-svg-icons'
import EventBus from './eventBus';

library.add(faXmark, faFan, faArrowUp, faArrowDown, faGear)

const user = localStorage.getItem('user');
if (user) {
    store.commit('setLogin', JSON.parse(user));
}

const app = createApp(App);

app.config.globalProperties.$eventBus = EventBus

// load router
app.use(store);
app.use(router);
app.use(ElementPlus);
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app');
