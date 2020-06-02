<template>
    <div id="app">
        <md-toolbar class="top-bar md-dense">
            <md-button class="md-icon-button" @click="showNavigation = !showNavigation">
                <md-icon>menu</md-icon>
            </md-button>
            <span class="md-title">CroCoMap</span>
        </md-toolbar>

        <md-drawer class="md-drawer md-drawer--modal" :md-active.sync="showNavigation" md-swipeable>
            <md-toolbar class="md-transparent" md-elevation="0">
                <span class="md-title">CroCoMap</span>
            </md-toolbar>

            <md-list>
                <md-list-item @click="showNavigation = false" to="/" exact>
                    Home
                </md-list-item>
                <md-list-item @click="showNavigation = false" to="/find/">
                    Find
                </md-list-item>
                <md-list-item @click="showNavigation = false" to="/fix/">
                    Fix
                </md-list-item>
                <md-list-item @click="showNavigation = false" to="/verify/">
                    Verify
                </md-list-item>
            </md-list>
        </md-drawer>
        <md-content class="main-content" id="main-content">
            <router-view></router-view>
<!--            <md-dialog :md-active="locationPrompt">-->
<!--                <md-dialog-title>Where are you currently located?</md-dialog-title>-->
<!--                <md-dialog-content>-->
<!--                    <md-field>-->
<!--                        <label for="location">Location</label>-->
<!--                        <md-select v-model="location" name="location" id="location" md-dense>-->
<!--                            <md-option v-for="l in locations" :key="l.value" :value="l">-->
<!--                                {{l}}-->
<!--                            </md-option>-->
<!--                        </md-select>-->
<!--                    </md-field>-->
<!--                    <md-dialog-actions>-->
<!--                        <md-button class="md-primary md-raised confirm-button" @click="confirmLocation" :disabled="!location">confirm</md-button>-->
<!--                    </md-dialog-actions>-->
<!--                </md-dialog-content>-->
<!--            </md-dialog>-->
        </md-content>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'

    export default {
        name: 'app',
        components: {},
        data: () => ({
            showNavigation: false,
            showSidepanel: false,
            locationPrompt: true,
            location: null,
            locations: ["Delft", "New York", "Beijing", "Melbourne"].sort()
        }),
        mounted() {
            this.location = this.getLocation();
        },
        methods: {
            ...mapGetters(['getLocation']),
            ...mapMutations(['setLocation']),
            confirmLocation: function() {
                this.setLocation(this.location);
                this.locationPrompt = false;
            }
        }
    }
</script>
<style>
    body {
        height: 100%;
        overflow: hidden;
    }

    :root {
        --MSU-green: #243E36;
        --metallic-gold: #C2A83E;
        --forest-green: #7CA982;
        --nyanza: #E0EEC6;
        --ivory: #F1F7ED;
        --ivory-white: #FFFFFF;
        --background-color: #EFEFEF;

        /* Override MDC theme colors */
        --mdc-theme-primary: var(--MSU-green) !important;
        --mdc-theme-secondary: var(--metallic-gold) !important;
    }

    #app {
        font-family: 'Roboto', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    .top-bar {
        background-color: var(--mdc-theme-primary) !important;
    }

    .top-bar .md-title, .md-toolbar.md-theme-default .md-icon {
        color: var(--ivory-white) !important;
    }

    .md-overlay {
        top: 48px !important;
        height: calc(100vh - 48px) !important;
    }

    .md-drawer {
        top: 48px !important;
        width: 200px !important;
        height: calc(100vh - 48px) !important;
    }

    .md-list.md-theme-default .router-link-active .md-list-item-content {
        color: var(--mdc-theme-secondary) !important;
    }

    .md-card {
        height: 100%;
        max-height: calc(100vh - 64px) !important;
    }

    .card-content {
        height: 100%;
        padding-bottom: 8px !important;
        max-height: calc(100% - 48px);
        overflow-y: scroll;
    }

    .md-progress-spinner.md-theme-default .md-progress-spinner-circle {
        stroke: var(--nyanza) !important;
    }

    .progress {
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }

    .md-empty-state {
        height: 100%;
    }

    .confirm-button, .empty-state-button {
        background-color: var(--mdc-theme-secondary) !important;
    }

    .info-icon {
        font-family: 'Material Icons Outlined' !important;
        margin-right: 0 !important;
    }

    .content {
        height: 100%;
        width: 100%;
        max-width: 100vw;
    }

    .md-layout {
        margin-bottom: 16px;
    }

    .md-dialog-container {
        transform: none !important;
    }
</style>
