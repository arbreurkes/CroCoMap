import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';
import { saveAs } from 'file-saver';

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
        existingSnapshots: [],
        findAnnotations: [],
        fixSnapshots: [{position: {lat: 0, lng:0}}],
        verifySnapshots: [],
        verifyVotes: [],
        results: [],
        lastSavedValue: null,
        snackbarMessage: ""
    },
    getters: {
        getLocation: (state) => state.location,
        getPosition: (state) => state.position,
        getCoordinates: (state) => state.locations[state.location],
        getExistingSnapshots: (state) => state.existingSnapshots,
        getFindAnnotations: (state) => state.findAnnotations,
        getFixSnapshots: (state) => state.fixSnapshots,
        getVerifySnapshots: (state) => state.verifySnapshots,
        getResults: (state) => state.results,
        getVerifyVotes: (state) => state.verifyVotes,
        getSnackbarMessage: (state) => state.snackbarMessage,
    },
    mutations: {
        setLocation: (state, location) => (state.location = location),
        setPosition: (state, position) => (state.position = position),
        setExistingSnapshots: (state, value) => (state.existingSnapshots = value),
        setFindAnnotations: (state, list) => (state.findAnnotations = list),
        setFixSnapshots: (state, list) => (state.fixSnapshots = list),
        setVerifySnapshots: (state, object) => (state.verifySnapshots = object),
        setVerifyVotes: (state, value) => (state.verifyVotes.push(value)),
        setResults: (state, value) => (state.results = value),
        setLastSavedValue: (state, value) => (state.lastSavedValue = value),
        setSnackbarMessage: (state, value) => (state.snackbarMessage = value)
    },
    actions: {
        updateVerifyVotes({commit}, keyValue) {
            commit('setVerifyVotes', keyValue);
        },
        async loadExistingSnapshots({commit}) {
            axios.get('/resources/findAnnotations.json').then(response => {
                commit('setExistingSnapshots', response.data)
            });
        },
        async loadVerifySnapshots({commit}) {
            axios.get('/resources/verifySnapshots.json').then(response => {
                commit('setVerifySnapshots', response.data)
            });
        },
        async loadFixSnapshots({commit}) {
            axios.get('/resources/fixSnapshots.json').then(response => {
                commit('setFixSnapshots', response.data)
            });
        },
        async storeFile({commit}, value) { // value[] -> [0] = fileName, [1] = value
            var blob = new Blob([JSON.stringify(value[1])], {type: "text/plain"});
            saveAs(blob, value[0]);
            commit('setLastSavedValue', value[1])
        }
    }
});