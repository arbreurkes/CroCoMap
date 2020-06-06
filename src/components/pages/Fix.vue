<template>
    <div class="fix-page">
        <gmap-street-view-panorama
                :position="snapshots[fixIndex].position"
                :zoom="1"
                :options="{
                            disableDefaultUI: true,
                            draggable: false,
                            clickableIcons: false,
                            streetViewControl: false,
                            zoomControl: false,
                            scrollWheel: false,
                            clickToGo: true,
                            panControl: false,
                            linksControl: false,
                            pov: snapshots[fixIndex]['pov']
                        }"
                class="fix-pano" ref="pano">
        </gmap-street-view-panorama>
        <h2 class="fix-count">Annotations Left: {{markers.length - fixIndex}}</h2>
        <md-speed-dial class="fix-dial" md-direction="bottom">
            <md-speed-dial-target class="annotate-button vote-button">
                <md-icon class="md-morph-initial">menu_open</md-icon>
                <md-icon class="md-morph-final">sentiment_satisfied_alt</md-icon>
            </md-speed-dial-target>
            <md-speed-dial-content class="">
                <md-button class="md-icon-button">
                    <md-tooltip md-direction="right">Show Help</md-tooltip>
                    <md-icon>help</md-icon>
                </md-button>
                <md-button class="md-icon-button" @click="showSubmit = true" v-if="fixIndex > 0">
                    <md-tooltip md-direction="right">Done!</md-tooltip>
                    <md-icon>done</md-icon>
                </md-button>
            </md-speed-dial-content>
        </md-speed-dial>
        <span class="fix-options" v-if="takingSnapshot">
            <md-button
                       :class="['md-fab', 'md-raised', 'left-button', 'vote-button']">
                <md-tooltip class="big-tooltip" md-direction="bottom">Take Snapshot</md-tooltip>
                <md-icon>photo_camera</md-icon>
            </md-button>
            <md-button :class="['md-fab', 'md-raised', 'md-primary', 'right-button', 'omit-button']">
                <md-tooltip class="big-tooltip" md-direction="bottom">Cancel Snapshot</md-tooltip>
                <md-icon>close</md-icon>
            </md-button>
        </span>
        <md-card class="instructions fix-instructions" v-if="snapshotsLoaded">
            <md-card-header>
                <div class="md-title instruction-title">Instructions</div>
            </md-card-header>
            <md-card-content>
                Click markers to view the corresponding snapshot.
                Either accept it if represents the object well, or reject and retake the snapshot like in the find task.
            </md-card-content>
        </md-card>
        <md-dialog class="submit-dialog" :md-active="showSubmit">
            <md-dialog-title class="dialog-title dialog-title-custom">Submit</md-dialog-title>
            <md-dialog-content class="dialog-content dialog-content-custom">
                <md-empty-state
                        md-icon="check_circle_outline"
                        :md-description="'You are about to submit ' + this.changeCount + ' new ' + (this.changeCount === 1 ? 'change' : 'changes') + '. This will end your fix task. Are you sure?'">
                    <span class="button-span">
                        <md-button class="vote-button md-raised" @click="submit()">Confirm</md-button>
                        <md-button class="omit-button md-raised" @click="showSubmit = false">CANCEL</md-button>
                    </span>
                </md-empty-state>
            </md-dialog-content>
        </md-dialog>
    </div>
</template>
<script>
    import {gmapApi} from "vue2-google-maps";
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: 'Fix',
        components: {},
        data: function () {
            return {
                pano: null,
                markers: [],
                fixIndex: 0,
                changeCount: 0,
                takingSnapshot: false,
                showSubmit: true
            }
        },
        computed: {
            google: gmapApi,
            snapshots: function () {
                return this.getFixSnapshots();
            },
            snapshotsLoaded: function () {
                return this.snapshots[0].position.lat !== 0 && this.snapshots[0].position.lng !== 0;
            }
        },
        watch: {
            google: function () {
                if (this.google !== null && this.snapshotsLoaded) this.initPano();
            },
            snapshotsLoaded: function () {
                if (this.google !== null && this.snapshotsLoaded) this.initPano();
            }
        },
        mounted: function () {
            this.loadFixSnapshots();
        },
        methods: {
            ...mapActions(['loadFixSnapshots']),
            ...mapGetters(['getFixSnapshots']),
            initPano: function () {
                this.pano = this.$refs.pano.$panoObject;

                this.initMarkers();
            },
            initMarkers: function () {
                this.snapshots.forEach(snapshot => {
                    var marker = new this.google.maps.Marker({
                        position: snapshot.location,
                        map: this.pano,
                        title: 'Annotation'
                    });

                    this.markers.push(marker);
                });
            }
        }
    };
</script>
<style>
    .fix-pano {
        height: calc(100vh - 48px);
        width: calc(100vw);
    }

    .fix-instructions {
        top: 58px;
        left: 10px;
        max-height: 176px !important;
    }

    .fix-count {
        text-align: center;
        position: absolute;
        z-index: 1;
        bottom: -15px;
        width: 184px;
        color: white;
        left: calc(50vw - 92px);
    }

    .fix-dial {
        position: absolute;
        left: calc(50vw - 28px);
        top: 58px;
        z-index: 999;
    }

    .fix-options {
        width: 120px;
        justify-content: center;
        position: absolute;
        left: calc(50vw - 60px);
        bottom: 10px;
        z-index: 999;
    }

    .left-button {
        margin-left: 0;
        margin-top: 0;
    }

    .right-button {
        margin-right: 0;
        margin-top: 0;
    }

    .big-tooltip {
        margin-bottom: 8px;
    }
</style>