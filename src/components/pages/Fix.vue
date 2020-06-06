<template>
    <div class="tasks-page">
        <div v-if="!done">
            <gmap-street-view-panorama
                    :position="snapshots[fixIndex].position"
                    :zoom="1"
                    :options="{
                            disableDefaultUI: true,
                            draggable: false,
                            clickableIcons: false,
                            streetViewControl: false,
                            zoomControl: true,
                            scrollWheel: false,
                            clickToGo: true,
                            panControl: false,
                            linksControl: false,
                            pov: snapshots[fixIndex]['pov']
                        }"
                    class="fix-pano" ref="pano">
            </gmap-street-view-panorama>
            <h2 class="fix-count">Annotations Left: {{snapshots.length - fixIndex}}</h2>
            <span class="fix-options" v-if="takingSnapshot">
                <md-button
                        :class="['md-fab', 'md-raised', 'left-button', 'vote-button']" @click="takeSnapshot">
                    <md-tooltip class="big-tooltip" md-direction="bottom">Take Snapshot</md-tooltip>
                    <md-icon>photo_camera</md-icon>
                </md-button>
                <md-button :class="['md-fab', 'md-raised', 'md-primary', 'right-button', 'omit-button']" @click="cancelSnapshot">
                    <md-tooltip class="big-tooltip" md-direction="bottom">Cancel Snapshot</md-tooltip>
                    <md-icon>close</md-icon>
                </md-button>
            </span>
            <md-card class="instructions fix-instructions" v-if="snapshotsLoaded">
                <md-card-header>
                    <div class="md-title instruction-title">Instructions</div>
                </md-card-header>
                <md-card-content>
                    Look around and click markers to view the corresponding snapshot. Either accept it if represents the object well, or reject and retake the snapshot like in the find task.
                </md-card-content>
            </md-card>
            <md-dialog class="submit-dialog" :md-active="ratingSnapshot">
                <md-dialog-title class="dialog-title dialog-title-custom">Accept Or Retake Snapshot</md-dialog-title>
                <md-dialog-content class="dialog-content dialog-content-custom">
                    <img class="fix-img" :src="snapshots[fixIndex].First" alt="Image failed to load."/>
                </md-dialog-content>
                <md-dialog-actions class="actions">
                    <md-button class="md-icon-button vote-button md-raised" @click="acceptSnapshot">
                        <md-tooltip md-direction="left" style="z-index: 1001;">Accept</md-tooltip>
                        <md-icon>check</md-icon>
                    </md-button>
                    <md-button class="md-icon-button omit-button md-raised" @click="retakeSnapshot">
                        <md-tooltip md-direction="right" style="z-index: 1001;">Retake</md-tooltip>
                        <md-icon>edit</md-icon>
                    </md-button>
                </md-dialog-actions>
            </md-dialog>
        </div>
        <md-empty-state
                v-if="done"
                class="verify-empty"
                md-icon="verified"
                md-label="All set!"
                :md-description="'You have completed your fix tasks for now.' + submitText + 'Thank you!'">
        </md-empty-state>
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
                <md-button class="md-icon-button" @click="showSubmit = true" v-if="fixIndex === snapshots.length && !submitted">
                    <md-tooltip md-direction="right">Done!</md-tooltip>
                    <md-icon>done</md-icon>
                </md-button>
            </md-speed-dial-content>
        </md-speed-dial>
        <md-dialog class="submit-dialog" :md-active="showSubmit">
            <md-dialog-title class="dialog-title dialog-title-custom">Submit</md-dialog-title>
            <md-dialog-content class="dialog-content dialog-content-custom">
                <md-empty-state
                        md-icon="check_circle_outline"
                        :md-description="'You are about to submit ' + this.changeCount + ' new ' + (this.changeCount === 1 ? 'change' : 'changes') + '. This will end your fix task. Are you sure?'">
                    <span class="button-span">
                        <md-button class="vote-button md-raised" @click="submit">Confirm</md-button>
                        <md-button class="omit-button md-raised" @click="showSubmit = false">CANCEL</md-button>
                    </span>
                </md-empty-state>
            </md-dialog-content>
        </md-dialog>
        <canvas ref="canvas" class="canvas"></canvas>
    </div>
</template>
<script>
    import {gmapApi} from "vue2-google-maps";
    import {mapActions, mapGetters, mapMutations} from "vuex";

    export default {
        name: 'Fix',
        components: {},
        data: function () {
            return {
                pano: null,
                marker: null,
                fixIndex: 0,
                changeCount: 0,
                ratingSnapshot: false,
                takingSnapshot: false,
                showSubmit: false,
                submitted: false,
                indices: ['Second', 'Third', 'Fourth', 'Fifth', 'Sixth']
            }
        },
        computed: {
            google: gmapApi,
            snapshots: function () {
                return this.getFixSnapshots();
            },
            snapshotsLoaded: function () {
                return this.snapshots[0].position.lat !== 0 && this.snapshots[0].position.lng !== 0;
            },
            done: function() {
                return this.fixIndex >= this.snapshots.length;
            },
            submitText: function() {
                return this.submitted ? "" : " Submit via the menu button at the top of the screen. ";
            }
        },
        watch: {
            google: function () {
                if (this.google !== null && this.snapshotsLoaded) this.initPano();
            },
            snapshotsLoaded: function () {
                if (this.google !== null && this.snapshotsLoaded) this.initPano();
            },
            fixIndex: function() {
                if (this.done) {
                    this.ratingSnapshot = false;
                } else if (this.fixIndex > 0) {
                    this.initMarker();
                }
            }
        },
        mounted: function () {
            this.loadFixSnapshots();
        },
        methods: {
            ...mapActions(['loadFixSnapshots', 'storeFile']),
            ...mapGetters(['getFixSnapshots']),
            ...mapMutations(['setFixSnapshots']),
            initPano: function () {
                this.pano = this.$refs.pano.$panoObject;

                this.initMarker();
            },
            initMarker: function () {
                if (this.marker) {
                    this.marker.setMap(null);
                }

                var that = this;
                var snapshot = that.snapshots[that.fixIndex];
                that.marker = new that.google.maps.Marker({
                    index: that.fixIndex,
                    position: snapshot.location,
                    map: that.pano,
                    title: 'Annotation'
                });

                that.marker.addListener('click', function () {
                    that.showMarkerContent();
                });
            },
            showMarkerContent: function () {
                this.ratingSnapshot = true;
            },
            acceptSnapshot: function() {
                this.ratingSnapshot = false;
                this.takingSnapshot = false;
                this.fixIndex++;
            },
            retakeSnapshot: function() {
                this.ratingSnapshot = false;
                this.takingSnapshot = true;
            },
            takeSnapshot: function() {
                this.panoPosition = this.pano.getPosition();
                this.zoom = this.pano.getZoom();
                this.pov = this.pano.getPov();
                this.fov = (180 / Math.pow(2, this.zoom));

                var url = "https://maps.googleapis.com/maps/api/streetview?size=320x320" +
                    "&location=" + this.panoPosition.lat() + "," + this.panoPosition.lng() +
                    "&fov=" + this.fov +
                    "&heading=" + this.pov.heading + "" +
                    "&pitch=" + this.pov.pitch +
                    "&key=" + process.env.VUE_APP_API_KEY;

                var that = this;
                var image = new Image();
                image.onload = function () {
                    var canvas = that.$refs.canvas;

                    canvas.width = 320;
                    canvas.height = 320;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0);
                    var imageUrl = canvas.toDataURL("image/png");

                    for (var i = 0; i < that.indices.length; i++) {
                        var index = that.indices[i];
                        if (that.snapshots[that.fixIndex][index] === "") {
                            that.snapshots[that.fixIndex][index] = imageUrl;
                            break;
                        }
                    }

                    that.changeCount++;
                    that.acceptSnapshot();
                };

                image.setAttribute('crossOrigin', 'anonymous'); //
                image.src = url;
            },
            cancelSnapshot: function() {
                this.ratingSnapshot = true;
                this.takingSnapshot = false;
            },
            submit: function() {
                this.submitted = true;
                this.showSubmit = false;
                this.setFixSnapshots(this.snapshots);
                this.storeFile(['fixedSnapshots.json', this.snapshots]);
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

    .fix-img {
        border-radius: 50%;
        height: 320px !important;
    }

    .actions {
        justify-content: center !important;
    }

    .md-dialog-actions .md-button{
        min-width: 0;
    }

    .md-dialog-actions .md-button .md-icon {
        color: white;
    }
</style>