"use strict"
import './styles/main.scss';

import "core-js";
import "regenerator-runtime/runtime";
//import Main from './scripts/main';
//Main.components;

import Vue from 'vue';
import App from './scripts/App.vue';

//Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app');