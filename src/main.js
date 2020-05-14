import Vue from 'vue';
import $ from 'jquery';
import App from './App.vue';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import store from './store'
import * as VueGoogleMaps from 'vue2-google-maps'

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

import HelloWorld from "./components/pages/HelloWorld";
import Tasks from "./components/pages/Tasks";

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
    name: 'Home',
    component: HelloWorld,
    props: {msg: "Welcome to the CC Dashboard"}
  },
  {
    path: '/tasks/*',
    name: 'Tasks',
    component: Tasks,
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