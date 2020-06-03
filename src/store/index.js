import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';

Vue.use(Vuex);


export default new Vuex.Store({
    state: {
        foo: [],
        location: "Delft", // TODO: Change to null
        position: null,
        locations: {
            "Beijing": {lat: 39.9390731, lng: 116.1172741},
            "Delft": {lat: 52.01165376397885, lng: 4.359065304767967},
            "New York": {lat: 40.7128, lng: -74.0060},
            "Melbourne": {lat: -37.8136, lng: 144.9631}
        }
    },
    getters: {
        getFoo: (state) => state.foo,
        getLocation: (state) => state.location,
        getPosition: (state) => state.position,
        getCoordinates: (state) => state.locations[state.location]
    },
    mutations: {
        setFoo: (state, foo) => (state.foo = foo),
        setLocation: (state, location) => (state.location = location),
        setPosition: (state, position) => (state.position = position)
    },
    actions: {
        async loadFoo({commit}) {
            axios.get('http://localhost:8080/foo').then(response => {
                commit('setFoo', response.data)
            });
        }
    }
});