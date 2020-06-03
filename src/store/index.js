import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';

Vue.use(Vuex);


export default new Vuex.Store({
    state: {
        location: null,
        position: null,
        locations: {
            "Beijing": {lat: 39.9390731, lng: 116.1172741},
            "Delft": {lat: 52.01165376397885, lng: 4.359065304767967},
            "New York": {lat: 40.7128, lng: -74.0060},
            "Melbourne": {lat: -37.8136, lng: 144.9631}
        },
        verifySnapshots: [],
        verifyVotes: []
    },
    getters: {
        getLocation: (state) => state.location,
        getPosition: (state) => state.position,
        getCoordinates: (state) => state.locations[state.location],
        getVerifySnapshots: (state) => state.verifySnapshots,
        getVerifyVotes: (state) => state.verifyVotes
    },
    mutations: {
        setLocation: (state, location) => (state.location = location),
        setPosition: (state, position) => (state.position = position),
        setVerifySnapshots: (state, object) => (state.verifySnapshots = object),
        setVerifyVotes: (state, value) => (state.verifyVotes.push(value))
    },
    actions: {
        updateVerifyVotes({commit}, keyValue) {
            commit('setVerifyVotes', keyValue);
        },
        async loadVerifySnapshots({commit}) {
            axios.get('/resources/verifySnapshots.json').then(response => {
                commit('setVerifySnapshots', response.data)
            });
        }
    }
});