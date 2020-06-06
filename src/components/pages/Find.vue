<template>
    <div class="tasks-page" ref="find">
        <div v-if="!done">
            <md-tabs md-alignment="fixed" md-sync-route>
                <template slot="md-tab" slot-scope="{tab}">
                <span class="tab-label">
                    <md-icon class="tab-icon" v-if="tab.data.icon">{{tab.data.icon}}</md-icon> {{tab.label}}
                </span>
                </template>

                <md-tab id="tab-map" class="tab-one" md-label="Map" :md-template-data="{icon: 'map'}"
                        to="/find/tabOne">
                    <GmapMap
                            Map
                            :center="position"
                            :zoom="16"
                            :options="{
                    disableDefaultUI: true,
                    draggable: false,
                    clickableIcons: false,
                    streetViewControl: true
                }"
                            map-type-id="terrain"
                            class="map"
                            ref="mapRef"
                    >
                    </GmapMap>
                </md-tab>
                <md-tab id="tab-two" class="tab-two" md-label="Street View" :md-template-data="{icon: 'streetview'}"
                        to="/find/tabTwo">
                    <h2 class="annotation-count">Annotations: {{annotations.length}}</h2>
                    <div class="overlay-circle" v-if="showOverlay"></div>
                    <div ref="overlay" class='overlay' v-if="showOverlay" @click="annotateFunc"></div>
                    <canvas ref="canvas" class="canvas"></canvas>
                    <span class="options">
                    <md-speed-dial class="" md-direction="bottom">
                        <md-speed-dial-target class="annotate-button vote-button">
                            <md-icon class="md-morph-initial">menu_open</md-icon>
                            <md-icon class="md-morph-final">sentiment_satisfied_alt</md-icon>
                        </md-speed-dial-target>
                        <md-speed-dial-content class="">
                            <md-button class="md-icon-button">
                                <md-tooltip md-direction="right">Show Help</md-tooltip>
                                <md-icon>help</md-icon>
                            </md-button>
                            <md-button class="md-icon-button" @click="showSubmit = true" v-if="annotationIndex > 0">
                                <md-tooltip md-direction="right">Done!</md-tooltip>
                                <md-icon>done</md-icon>
                            </md-button>
                        </md-speed-dial-content>
                    </md-speed-dial>
                    <md-button :class="['md-fab', 'md-raised', 'md-primary', 'annotate-button', pinButtonClass]"
                               @click="toggleAnnotation">
                        <md-tooltip class="big-annotation" md-direction="bottom">{{pinButtonTooltip}}</md-tooltip>
                        <md-icon>{{pinButtonIcon}}</md-icon>
                    </md-button>
                </span>
                    <md-button v-if="findStep === 2"
                               :class="['md-fab', 'md-raised', 'md-primary', 'snapshot-button', 'vote-button']"
                               @click="takeSnapshot">
                        <md-tooltip class="big-annotation" md-direction="bottom">Take Snapshot</md-tooltip>
                        <md-icon>add_a_photo</md-icon>
                    </md-button>
                    <div ref="pano" class="map"></div>
                    <md-card class="instructions" v-if="location">
                        <md-card-header>
                            <div class="md-title instruction-title">Instructions</div>
                        </md-card-header>
                        <md-card-content>
                            {{instructions[findStep]}}
                        </md-card-content>
                    </md-card>
                </md-tab>
            </md-tabs>
            <hr class="tab-divider"/>
        </div>
        <md-empty-state
                v-if="done"
                class="verify-empty"
                md-icon="verified"
                md-label="All set!"
                md-description="You have completed your find tasks for now. Thank you!">
        </md-empty-state>
        <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
            <span style="width: 100%; text-align: center;">Please stay within the allocated area!</span>
        </md-snackbar>
        <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="showPinSnackbar" md-persistent>
            <span style="width: 100%; text-align: center;">The point you clicked is on a too high angle in the panorama. Please move closer and/or click on the ground.</span>
        </md-snackbar>
        <md-dialog :md-active="showSubmit">
            <md-dialog-title class="dialog-title dialog-title-custom">Submit</md-dialog-title>
            <md-dialog-content class="dialog-content dialog-content-custom">
                <md-empty-state
                        md-icon="check_circle_outline"
                        :md-description="'You are about to submit ' + (this.annotations.length) + ' new ' + (annotationIndex > 1 ? 'annotations' : 'annotation') + '. This will end your find task. Are you sure?'">
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
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import Raycast from '../../utils/raycast'

    export default {
        name: 'Find',
        components: {},
        data: function () {
            return {
                position: {lat: 0, lng: 0},
                panoPosition: {},
                previousPosition: this.position,
                polygons: [],
                outerCoords: [{lat: 90, lng: -90}, {lat: 90, lng: 90}, {lat: 90, lng: 180}, {lat: 90, lng: -90},
                    {lat: -90, lng: -90}, {lat: -90, lng: 180}, {lat: -90, lng: 90}, {lat: -90, lng: -90}],
                innerCoords: [],
                showSnackbar: false,
                showPinSnackbar: false,
                showOverlay: false,
                showSubmit: false,
                canvasSource: "",
                imageUrl: "",
                instructions: [
                    "Click the push pin button at the top of the screen to start annotating. Alternatively, show help using the menu button.",
                    "Place a marker by clicking on the image. Clicking inside the circle achieves the highest accuracy.",
                    "Zoom all the way in and pan to the object, then click the screenshot button at the bottom of the screen.",
                    "Well done, you annotated five objects. Submit your work through the left button at the top of the screen."
                ],
                findStep: 0,
                latestMarker: null,
                annotationIndex: 0,
                annotations: [],
                done: false
            }
        },
        computed: {
            google: gmapApi,
            location: function () {
                return this.getLocation()
            },
            annotating: function () {
                return this.findStep > 0 && this.findStep < 3;
            },
            pinButtonClass: function () {
                return this.annotating ? "omit-button" : "vote-button";
            },
            pinButtonIcon: function () {
                return this.annotating ? "close" : "push_pin";
            },
            pinButtonTooltip: function () {
                return this.annotating ? "Cancel Annotation" : "Add Annotation";
            }
        },
        watch: {
            location: {
                immediate: true,
                handler: function () {
                    if (this.location !== null) {
                        this.position = this.getCoordinates();
                        this.$nextTick(() => {
                            this.initMap();
                        });
                    }
                }
            }
        },
        mounted: function () {
            this.$nextTick(() => {
                if (this.$route.path === "/find/") {
                    this.$router.push("/find/tabOne")
                }
            });
        },
        methods: {
            ...mapGetters(["getLocation", "getCoordinates", "getPosition"]),
            ...mapMutations(["setPosition", "setFindAnnotations"]),
            ...mapActions(["storeFile"]),
            initMap: function () {
                var that = this;
                that.$refs.mapRef.$mapPromise.then((map) => {
                    that.google.maps.event.addListenerOnce(map, 'idle', function () {
                        var bounds = map.getBounds();
                        var latBounds = bounds.Ya;
                        var lngBounds = bounds.Ua;
                        var latDiff = Math.abs(latBounds.i - latBounds.j);
                        var lngDiff = Math.abs(lngBounds.i - lngBounds.j);

                        var quadrants = [{lat: latBounds.i, lng: lngBounds.i},
                            {lat: latBounds.i + latDiff / 2, lng: lngBounds.i},
                            {lat: latBounds.i, lng: lngBounds.i + lngDiff / 2},
                            {lat: latBounds.i + latDiff / 2, lng: lngBounds.i + lngDiff / 2}];
                        for (var i = 0; i < 2; i++) {
                            for (var j = i; j < i + 2; j++) {
                                if (i + j < 1 || Math.random() + Math.random() >= 1) {
                                    var boxLatDiff = latDiff / 10;
                                    var boxLngDiff = lngDiff / 10;

                                    var latRatio = Math.random();
                                    var lngRatio = Math.random();
                                    var startLat = Math.min(quadrants[i + j].lat + ((latDiff / 2) * latRatio),
                                        quadrants[i + j].lat + (latDiff / 2) - boxLatDiff);
                                    var startLng = Math.min(quadrants[i + j].lng + ((lngDiff / 2) * lngRatio),
                                        quadrants[i + j].lng + (lngDiff / 2) - boxLngDiff);

                                    that.innerCoords[that.innerCoords.length] = [{lat: startLat, lng: startLng},
                                        {lat: startLat + boxLatDiff, lng: startLng},
                                        {lat: startLat + boxLatDiff, lng: startLng + boxLngDiff},
                                        {lat: startLat, lng: startLng + boxLngDiff},
                                        {lat: startLat, lng: startLng}];

                                    that.polygons[that.polygons.length] = new that.google.maps.Polygon({
                                        paths: that.innerCoords[that.innerCoords.length - 1],
                                        strokeColor: '#0000FF',
                                        strokeOpacity: 0.3,
                                        strokeWeight: 1,
                                        map: map,
                                        fillOpacity: 0.0
                                    });

                                    if (i + j === 0) {
                                        that.panoPosition = {
                                            lat: startLat + (boxLatDiff / 2),
                                            lng: startLng + (boxLngDiff / 2)
                                        }
                                    }
                                }
                            }
                        }

                        var paths = [that.outerCoords];
                        that.innerCoords.forEach((o) => {
                            paths.push(o.reverse())
                        });

                        new that.google.maps.Polygon({
                            paths: paths,
                            strokeWeight: 0,
                            map: map,
                            fillColor: '#FF0000',
                            fillOpacity: 0.35
                        });

                        var pano = new that.google.maps.StreetViewPanorama(that.$refs.pano, {
                            position: that.panoPosition,
                            source: that.google.maps.StreetViewSource.OUTDOOR
                        });
                        map.setStreetView(pano);

                        that.pano = pano;

                        pano.addListener('position_changed', () => {
                            var pos = pano.getPosition();

                            if (pos !== that.previousPosition) {
                                var isInBounds = false;
                                for (var i = 0; i < that.polygons.length; i++) {
                                    if (that.google.maps.geometry.poly.containsLocation(pos, that.polygons[i])) {
                                        isInBounds = true;
                                        break;
                                    }
                                }

                                if (!isInBounds) {
                                    that.showSnackbar = true;
                                    pano.setPosition(that.previousPosition);
                                } else {
                                    that.previousPosition = pos;
                                }
                            }
                        });
                    });
                });
            },
            annotateFunc: function (ev) {
                var overlay = this.$refs.overlay;

                // Width and height of overlay div
                var width = overlay.clientWidth;
                var height = overlay.clientHeight;

                // normalized x- and y-value based on the overlay div 
                // in (-1, 1) range
                var normX = 2 * ev.offsetX / width - 1;
                var normY = 1 - 2 * ev.offsetY / height;

                var position = this.pano.getPosition();
                var zoom = this.pano.getZoom();
                var {heading, pitch} = this.pano.getPov();
                var fov = (180 / Math.pow(2, zoom));

                var r = Raycast.createNew(heading, pitch, normX, normY, fov, width / height);
                var l = r.get_latlng(position.lat(), position.lng());

                if (l === null) {
                    this.showPinSnackbar = true;
                } else {
                    this.latestMarker = new this.google.maps.Marker({
                        position: l,
                        map: this.pano,
                        title: 'Annotation'
                    });

                    this.annotations[this.annotationIndex] = {
                        location: l,
                        position: {},
                        pov: {},
                        First: "",
                        Second: "",
                        Third: "",
                        Fourth: "",
                        Fifth: ""
                    };

                    this.findStep = 2;
                    this.showOverlay = false;
                }
            },
            toggleAnnotation: async function () {
                if (this.annotating) {
                    this.showOverlay = false;
                    this.findStep = 0;

                    if (this.latestMarker) {
                        this.latestMarker.setMap(null);
                        this.annotations.pop();
                    }
                } else {
                    this.findStep = 1;
                    this.showOverlay = true;
                }
            },
            takeSnapshot: function () {
                this.panoPosition = this.pano.getPosition();
                this.zoom = this.pano.getZoom();
                this.pov = this.pano.getPov();
                this.fov = (180 / Math.pow(2, this.zoom));

                var url = "https://maps.googleapis.com/maps/api/streetview?size=640x640" +
                    "&location=" + this.panoPosition.lat() + "," + this.panoPosition.lng() +
                    "&fov=" + this.fov +
                    "&heading=" + this.pov.heading + "" +
                    "&pitch=" + this.pov.pitch +
                    "&key=" + process.env.VUE_APP_API_KEY;

                var that = this;
                var image = new Image();
                image.onload = function () {
                    var canvas = that.$refs.canvas;

                    canvas.width = 640;
                    canvas.height = 640;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0);
                    that.imageUrl = canvas.toDataURL("image/png");

                    that.annotations[that.annotationIndex]['position']['lat'] = that.panoPosition.lat();
                    that.annotations[that.annotationIndex]['position']['lng'] = that.panoPosition.lng();
                    that.annotations[that.annotationIndex]['pov']['heading'] = that.pov.heading;
                    that.annotations[that.annotationIndex]['pov']['pitch'] = that.pov.pitch;
                    that.annotations[that.annotationIndex]['First'] = that.imageUrl;
                    that.annotationIndex++;

                    that.findStep = that.annotationIndex < 5 ? 0 : 3;
                };

                image.setAttribute('crossOrigin', 'anonymous'); //
                image.src = url;
            },
            submit: function() {
                this.done = true;
                this.showSubmit = false;
                this.setFindAnnotations(this.annotations);
                this.storeFile(['findAnnotations.json', this.annotations])
            }
        }
    };
</script>
<style>
    .tasks-page {
        width: 100%;
        height: calc(100vh - 48px);
    }

    .tab-divider {
        position: absolute;
        width: 100vw;
        margin-top: -1px;
        top: 96px;
    }

    .tab-icon {
        margin-top: -5px;
    }

    .tab-label {
        font-size: 16px !important;
    }

    .md-tab {
        height: calc(100vh - 96px);
        max-height: 100%;
        /*width: 100%;*/
    }

    .tab-one {
        overflow-y: hidden;
    }

    .md-content.md-tabs-content {
        padding-bottom: 8px;
        height: calc(100vh - 96px) !important;
    }

    .md-button.md-tab-nav-button {
        max-width: 100vh !important;
    }

    .md-button.md-tab-nav-button.md-active {
        color: var(--forest-green) !important;
    }

    .md-tabs-indicator {
        background-color: var(--forest-green) !important;
    }

    .md-tabs .md-tabs-navigation .md-button .md-icon {
        color: var(--forest-green) !important;
    }

    .map {
        margin: -16px 0 0 -16px;
        height: calc(100% + 32px);
        width: calc(100% + 32px);
    }

    .options {
        width: 120px;
        justify-content: center;
        position: absolute;
        left: calc(150vw - 60px);
        top: 10px;
        z-index: 999;
    }

    .annotate-button {
        margin-right: 0;
        margin-top: 0;
    }

    .snapshot-button {
        position: absolute;
        bottom: 10px;
        left: calc(150vw - 28px)
    }

    .big-annotation {
        margin-top: 8px;
    }

    .canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 640px;
        height: 640px;
        z-index: -1;
    }

    .overlay {
        z-index: 998;
        position: absolute;
        top: 0;
        left: 100vw;
        width: 100vw;
        background-color: rgba(0, 0, 0, 0);
        height: calc(100vh - 96px) !important;
    }

    .overlay-circle {
        position: absolute;
        margin-left: calc(50vw - 25vh - 16px);
        margin-top: calc(50vh - 25vh);
        height: 50vh;
        width: 50vh;
        border: solid 3px rgb(255, 255, 255);
        border-radius: 50%;
        z-index: 997;
    }

    .tab-one, .tab-two {
        padding: 16px !important;
    }

    .instruction-title {
        margin-top: 0 !important;
    }

    .instructions {
        text-align: center;
        position: absolute;
        z-index: 999;
        top: 10px;
        left: calc(100vw + 10px);
        /*left: 100vw;*/
        width: 33%;
        max-height: 154px !important;
    }

    .annotation-count {
        text-align: center;
        position: absolute;
        z-index: 997;
        bottom: -15px;
        width: 140px;
        color: white;
        left: calc(150vw - 70px);
    }
</style>