import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';

Vue.use(Vuex);


export default new Vuex.Store({
    state: {
        foo: [],
    },
    getters: {
        getFoo: (state) => state.foo,
    },
    mutations: {
        setFoo: (state, foo) => (state.foo = foo),
    },
    actions: {
        async loadFoo({commit}) {
            axios.get('http://localhost:8080/foo').then(response => {
                commit('setFoo', response.data)
            });
        },
    }
});