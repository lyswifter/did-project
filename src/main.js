import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import axios from 'axios'
import VueAxios from 'vue-axios'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import {
    // create naive ui
    create,
    // component
    NDataTable
  } from 'naive-ui'

import "./assets/main.css";

const app = createApp(App);

const naive = create({
    components: [NDataTable]
})

app.use(createPinia());
app.use(router);
app.use(VueAxios, axios)
app.use(ElementPlus)
app.use(naive)

app.mount("#app");
