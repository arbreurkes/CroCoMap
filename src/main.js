import Vue from 'vue';
import $ from 'jquery';
import App from './App.vue';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import store from './store'
import * as VueGoogleMaps from 'vue2-google-maps'

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

import Find from "./components/pages/Find";
import Fix from "./components/pages/Fix";
import Verify from "./components/pages/Verify";

window.$ = $;
Vue.use(VueRouter);
Vue.use(VueMaterial);
Vue.config.productionTip = false;
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_API_KEY,
  }});

window.hashCode = function(e) {
    var hash = 0;
    for (var i = 0; i < e.length; i++) {
      var character = e.charCodeAt(i);
      hash = ((hash<<5)-hash)+character;
      hash = hash & hash; // Convert to 32bit integer
    }

    return hash;
};

export default {
  name: 'app',
  components: {}
}

const routes = [
  {
    path: '/',
    redirect: '/find/tabOne'
  },
  {
    path: '/find/*',
    name: 'Find',
    component: Find,
    props: {}
  },
  {
    path: '/fix/*',
    name: 'Fix',
    component: Fix,
    props: {}
  },
  {
    path: '/verify/*',
    name: 'Verify',
    component: Verify,
    props: {}
  }
];

const router = new VueRouter({
  routes
});

new Vue({
  name: 'Home',
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
}).$mount('#app');