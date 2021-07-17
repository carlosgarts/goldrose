import Vue from 'vue'
import App from './components/App.vue'


Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');

//Old
// import Rose from './components/rose';

// export default {
//     components: {
//         Rose
//     }
// };

// Rose();