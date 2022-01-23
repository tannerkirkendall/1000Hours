import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from './plugins/font-awesome'
import BalmUI from 'balm-ui'; // Official Google Material Components
import BalmUIPlus from 'balm-ui-plus'; // BalmJS Team Material Components
import 'balm-ui-css';
import Datepicker from 'vue3-date-time-picker';
import 'vue3-date-time-picker/dist/main.css'

createApp(App)
  .use(router)
  .use(store)
  .use(BalmUI)
  .use(BalmUIPlus)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component('Datepicker', Datepicker)
  .mount("#app");