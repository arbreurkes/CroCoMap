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
                <md-button class="md-icon-button" @click="showHelp">
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
                pano: null, // Street view panorama object.
                marker: null, // Current marker.
                fixIndex: 0, // Index of annotations working on.
                changeCount: 0, // Count how many snapshots retaken.
                ratingSnapshot: false, // Worker currently rating snapshot?
                takingSnapshot: false, // Worker currently taking snapshot?
                showSubmit: false, // Show submit prompt?
                submitted: false, // Worker has submitted task?
                indices: ['Second', 'Third', 'Fourth', 'Fifth', 'Sixth'] // Possible indices for result file (map-like objects).
            }
        },
        computed: {
            google: gmapApi, // Google maps API object
            snapshots: function () { // Annotations to fix.
                return this.getFixSnapshots();
            },
            snapshotsLoaded: function () { // Whether snapshots are fully loaded.
                return this.snapshots[0].position.lat !== 0 && this.snapshots[0].position.lng !== 0;
            },
            done: function() { // Whether worker has completed the task.
                return this.fixIndex >= this.snapshots.length;
            },
            submitText: function() { // Indicate whether worker still has to submit.
                return this.submitted ? "" : " Submit via the menu button at the top of the screen. ";
            }
        },
        watch: {
            google: function () { // On Google == loaded, initialize panorama.
                if (this.google !== null && this.snapshotsLoaded) this.initPano();
            }, // One of these two methods fires first, no double calls.
            snapshotsLoaded: function () { // On snapshots == loaded, initialize panorama.
                if (this.google !== null && this.snapshotsLoaded) this.initPano();
            },
            fixIndex: function() { // On fixIndex change:
                if (this.done) { // When done, worker cannot be rating an annotation.
                    this.ratingSnapshot = false;
                } else if (this.fixIndex > 0) { // When not yet done, load the next marker.
                    this.initMarker();
                }
            }
        },
        mounted: function () { // In first loading page.
            this.loadFixSnapshots();
        },
        methods: {
            ...mapActions(['loadFixSnapshots', 'storeFile']),
            ...mapGetters(['getFixSnapshots']),
            ...mapMutations(['setFixSnapshots', 'setShowTutorial']),
            initPano: function () { // Initialize the panorama.
                this.pano = this.$refs.pano.$panoObject; // Get the panorama from the Vue object.

                this.initMarker(); // Call method to initialize the first marker.
            },
            initMarker: function () { // Method to initialize a marker
                if (this.marker) { // Unload the previous marker, if any.
                    this.marker.setMap(null);
                }

                var that = this; // For nested calls.
                var snapshot = that.snapshots[that.fixIndex]; // Get snapshot corresponding to fix index.
                that.marker = new that.google.maps.Marker({ // Create a marker using Google API.
                    index: that.fixIndex, // Set custom value: index.
                    position: snapshot.location, // Location of marker.
                    map: that.pano, // Map is belongs to, panorama in this case.
                    title: 'Annotation' // Shows on hover.
                });

                that.marker.addListener('click', function () { // Add an on-click event listener.
                    that.showMarkerContent(); // Show the corresponding content.
                });
            },
            showMarkerContent: function () { // Show the corresponding content.
                this.ratingSnapshot = true; // Triggers the visibility of the rating dialog.
            },
            acceptSnapshot: function() { // Accept the snapshot as is. Actually merely finalizes rating process.
                this.ratingSnapshot = false;
                this.takingSnapshot = false;
                this.fixIndex++;
            },
            retakeSnapshot: function() { // Start snapshot taking process.
                this.ratingSnapshot = false;
                this.takingSnapshot = true;
            },
            takeSnapshot: function() { // Retake snapshot.
                this.panoPosition = this.pano.getPosition(); // Get position from where snapshot is taken.
                this.zoom = this.pano.getZoom(); // Get zoom level from panorama.
                this.pov = this.pano.getPov(); // Get POV from panorama.
                this.fov = (180 / Math.pow(2, this.zoom)); // Calculate Field of view.

                var url = "https://maps.googleapis.com/maps/api/streetview?size=320x320" + // Load image from Static Street View API
                    "&location=" + this.panoPosition.lat() + "," + this.panoPosition.lng() + // Snapshot cannot be taken from regular panorama
                    "&fov=" + this.fov + // for security reasons.
                    "&heading=" + this.pov.heading + "" +
                    "&pitch=" + this.pov.pitch +
                    "&key=" + process.env.VUE_APP_API_KEY;

                var that = this; // For nested calls.
                var image = new Image(); // Create new HTML image.
                image.onload = function () { // Set on-load listener.
                    var canvas = that.$refs.canvas; // Get the canvas to draw the image on.

                    canvas.width = 320;
                    canvas.height = 320;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0);
                    var imageUrl = canvas.toDataURL("image/png"); // Convert canvas content to b64.

                    for (var i = 0; i < that.indices.length; i++) { // Determine which index this image can fill in the annotation object.
                        var index = that.indices[i];
                        if (that.snapshots[that.fixIndex][index] === "") {
                            that.snapshots[that.fixIndex][index] = imageUrl;
                            break;
                        }
                    }

                    that.changeCount++; // Indicate a change has been made.
                    that.acceptSnapshot(); // Finalize rating process.
                };

                image.setAttribute('crossOrigin', 'anonymous'); // Make sure image can be gotten crossOrigin.
                image.src = url; // Set source of image.
            },
            cancelSnapshot: function() { // Cancel taking the snapshot.
                this.ratingSnapshot = true;
                this.takingSnapshot = false;
            },
            submit: function() { // Submit the task.
                this.submitted = true;
                this.showSubmit = false;
                this.setFixSnapshots(this.snapshots); // Write to state.
                this.storeFile(['fixedSnapshots.json', this.snapshots]); // Write to file.
            },
            showHelp: function() { // Show the tutorial.
                this.setShowTutorial(true);
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