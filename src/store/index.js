import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';
import { saveAs } from 'file-saver';

Vue.use(Vuex); // Use Vuex to store state.


export default new Vuex.Store({
    state: { // The state in which all global variables are stored
        location: null, // The user defined location.
        position: null, // The position of the map/street view.
        locations: { // Predefined locations with their coordinates.
            "Beijing": {lat: 39.9390731, lng: 116.1172741},
            "Delft": {lat: 52.01165376397885, lng: 4.359065304767967},
            "New York": {lat: 40.7128, lng: -74.0060},
            "Melbourne": {lat: -37.8136, lng: 144.9631}
        },
        existingSnapshots: [], // Find annotations made by other workers.
        findAnnotations: [], // Find annotations made by this worker.
        fixSnapshots: [{position: {lat: 0, lng:0}}], // Annotations to fix for Fix phase.
        verifySnapshots: [], // Annotations to verify during Verify phase.
        verifyVotes: [], // Verify votes of the worker.
        results: [], // Finalized array of votes of the worker, filled on completion of Verify.
        lastSavedValue: null, // Last value written to file (actual value, not name).
        snackbarMessage: "", // Message to show in snackbar, non-empty triggers showing snackbar.
        showTutorial: true, // Whether tutorial should be shown.
        tutorialComplete: false // Whether tutorial has been completed at least once.
    },
    getters: {  // Getters for each variable in state.
        getLocation: (state) => state.location,
        getLocations: (state) => Object.keys(state.locations).sort(),
        getPosition: (state) => state.position,
        getCoordinates: (state) => state.locations[state.location],
        getExistingSnapshots: (state) => state.existingSnapshots,
        getFindAnnotations: (state) => state.findAnnotations,
        getFixSnapshots: (state) => state.fixSnapshots,
        getVerifySnapshots: (state) => state.verifySnapshots,
        getResults: (state) => state.results,
        getVerifyVotes: (state) => state.verifyVotes,
        getSnackbarMessage: (state) => state.snackbarMessage,
        getShowTutorial: (state) => state.showTutorial,
        getTutorialComplete: (state) => state.tutorialComplete
    },
    mutations: { // Setters for each variable in state.
        setLocation: (state, location) => (state.location = location),
        setPosition: (state, position) => (state.position = position),
        setExistingSnapshots: (state, value) => (state.existingSnapshots = value),
        setFindAnnotations: (state, list) => (state.findAnnotations = list),
        setFixSnapshots: (state, list) => (state.fixSnapshots = list),
        setVerifySnapshots: (state, object) => (state.verifySnapshots = object),
        setVerifyVotes: (state, value) => (state.verifyVotes.push(value)), // Pushes value into array instead of overwrite.
        setResults: (state, value) => (state.results = value),
        setLastSavedValue: (state, value) => (state.lastSavedValue = value),
        setSnackbarMessage: (state, value) => (state.snackbarMessage = value),
        setShowTutorial: (state, value) => (state.showTutorial = value),
        setTutorialComplete: (state, value) => (state.tutorialComplete = value)
    },
    actions: { // Actions, commit to state and notify system. All except one are asynchronous.
        updateVerifyVotes({commit}, keyValue) { // Update the verify votes of the worker.
            commit('setVerifyVotes', keyValue);
        },
        async loadExistingSnapshots({commit}) { // Load the existing find annotations from file.
            axios.get('/resources/findAnnotations.json').then(response => {
                commit('setExistingSnapshots', response.data)
            });
        },
        async loadVerifySnapshots({commit}) { // Load the verify annotation from file.
            axios.get('/resources/verifySnapshots.json').then(response => {
                commit('setVerifySnapshots', response.data)
            });
        },
        async loadFixSnapshots({commit}) { // Load the fix annotations from file.
            axios.get('/resources/fixSnapshots.json').then(response => {
                commit('setFixSnapshots', response.data)
            });
        },
        async storeFile({commit}, value) { // Write to file: value[] -> [0] = fileName, [1] = value
            var blob = new Blob([JSON.stringify(value[1])], {type: "text/plain"});
            saveAs(blob, value[0]);
            commit('setLastSavedValue', value[1])
        }
    }
});