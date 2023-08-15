import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import store from './store/index.js';
import '@fortawesome/fontawesome-free/css/all.css';
import axios from 'axios';
import './assets/tailwind.css';
// Import jQuery
import $ from "jquery";
window.$ = window.jQuery = $;
const app = createApp(App);
// Import Bootstrap JavaScript
import "bootstrap";
axios.defaults.baseURL = 'https://seahorse-app-ih22h.ondigitalocean.app/blue-tech-api2'; // Replace with your actual API base URL

const token = localStorage.getItem('token');
if (token) {
  store.commit('setToken', token);
}

app.config.globalProperties.$axios = axios;

app.use(router);
app.use(store);
app.mount('#app');
