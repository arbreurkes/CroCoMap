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
                            <md-button class="md-icon-button" @click="showHelp">
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
            <md-dialog class="submit-dialog" :md-active="showSnapshot" v-if="showSnapshot">
                <md-dialog-content class="dialog-content dialog-content-custom">
                    <img class="fix-img" :src="imageSource" alt="Image failed to load."/>
                </md-dialog-content>
                <md-dialog-actions class="actions">
                    <md-button class="md-icon-button omit-button md-raised" @click="showSnapshot = false">
                        <md-tooltip md-direction="bottom" style="z-index: 1001;">Close</md-tooltip>
                        <md-icon>close</md-icon>
                    </md-button>
                </md-dialog-actions>
            </md-dialog>
        </div>
        <md-empty-state
                v-if="done"
                class="verify-empty"
                md-icon="verified"
                md-label="All set!"
                md-description="You have completed your find tasks for now. Thank you!">
        </md-empty-state>
        <md-dialog class="submit-dialog" :md-active="showSubmit">
            <md-dialog-title class="dialog-title dialog-title-custom">Submit</md-dialog-title>
            <md-dialog-content class="dialog-content dialog-content-custom">
                <md-empty-state
                        md-icon="check_circle_outline"
                        :md-description="'You are about to submit ' + (this.annotations.length) + ' new ' + (annotationIndex === 1 ? 'annotation' : 'annotations') + '. This will end your find task. Are you sure?'">
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
    import {mapActions, mapGetters, mapMutations} from 'vuex'
    import Raycast from '../../utils/raycast'

    export default {
        name: 'Find',
        components: {},
        data: function () {
            return {
                position: {lat: 0, lng: 0}, // Center of the map.
                panoPosition: {}, // Position of the street view.
                previousPosition: this.position, // The last position, initialized to the first position.
                polygons: [], // Array of all the rectangles to draw on the map, can be any polygon.
                outerCoords: [{lat: 90, lng: -90}, {lat: 90, lng: 90}, {lat: 90, lng: 180}, {lat: 90, lng: -90},  // Draw a red overlay over the entire map.
                    {lat: -90, lng: -90}, {lat: -90, lng: 180}, {lat: -90, lng: 90}, {lat: -90, lng: -90}],
                innerCoords: [], // Array of polygons that will actually be drawn, are the reversed of the polygons array.
                showOverlay: false, // Show the overlay cirlce during annotation.
                showSubmit: false, // Show the submit dialog.
                imageUrl: "", // Source of the image for taking snapshots.
                instructions: [ // Array of instructions to show in the instructions card.
                    "Click the push pin button at the top of the screen to start annotating. Alternatively, show help using the menu button.",
                    "Place a marker by clicking on the image. Clicking inside the circle achieves the highest accuracy.",
                    "Zoom all the way in and pan to the object, then click the screenshot button at the bottom of the screen.",
                    "Well done, you annotated five objects. Submit your work through the left button at the top of the screen."
                ],
                findStep: 0, // Index of which step you're at in the find process, used for showing instructions.
                latestMarker: null, // Last marker the worker placed.
                annotationIndex: 0, // Index of annotation working on.
                annotations: [], // Array of annotations made by worker.
                snapshotIndex: 0, // Index of snapshot to view.
                newMarker: false, // Indicates whether the clicked marker is from a new annotation, or one made by another worker.
                showSnapshot: false, // Indicates whether to view snapshot belonging to marker, true on clicking a marker.
                done: false // True on submitting task.
            }
        },
        computed: {
            google: gmapApi, // Google Maps API
            location: function () { // Get the location from store.
                return this.getLocation()
            },
            existingSnapshots: function() { // Get the annotations that other workers have made.
                return this.getExistingSnapshots()
            },
            annotating: function () { // Is the worker currently annotating?
                return this.findStep > 0 && this.findStep < 3;
            },
            pinButtonClass: function () { // Determines color of annotation button.
                return this.annotating ? "omit-button" : "vote-button";
            },
            pinButtonIcon: function () { // Determines icon of annotation button.
                return this.annotating ? "close" : "push_pin";
            },
            pinButtonTooltip: function () { // Determines tooltip of annotation button.
                return this.annotating ? "Cancel Annotation" : "Add Annotation";
            },
            imageSource: function () { // Determines image source for showing snapshot belonging to a marker.
                var index = this.snapshotIndex;
                return this.newMarker ? this.annotations[index].First : this.existingSnapshots[index].First;
            }
        },
        watch: {
            location: { // Watch the location
                immediate: true, // Watch immediately (also on first instantiation).
                handler: function () { // Handler method.
                    if (this.location !== null) { // If location is set
                        this.loadExistingSnapshots(); // Load the existing snapshots from file.
                        this.position = this.getCoordinates(); // Set the position to the coordinates belonging to the location.
                        this.$nextTick(() => { // On Vue's next tick (time).
                            this.initMap(); // Call the initialize map method.
                        });
                    }
                }
            },
            existingSnapshots: function() { // Watch the existing annotation.
                this.addExistingMarkers(); // Add the existing annotations to the street view.
            }
        },
        mounted: function () { // On first loading this page.
            this.$nextTick(() => { // On Vue's next tick (time).
                if (this.$route.path === "/find/") { // If the route is just "/find/"
                    this.$router.push("/find/tabOne") // Set to this route (otherwise tabs' styles do not correspond).
                }
            });
        },
        methods: {
            ...mapGetters(["getLocation", "getCoordinates", "getPosition", "getExistingSnapshots"]),
            ...mapMutations(["setPosition", "setFindAnnotations", 'setSnackbarMessage', 'setShowTutorial']),
            ...mapActions(["storeFile", "loadExistingSnapshots"]),
            initMap: function () { // Initialize map method.
                var that = this; // For nested calls.
                that.$refs.mapRef.$mapPromise.then((map) => { // Wait for maps API to be loaded, then callback =>
                    that.google.maps.event.addListenerOnce(map, 'idle', function () { // Add listener once to map being completely loaded and now idle
                        var bounds = map.getBounds(); // Get the bounds of the map relative to the screen width and height
                        var latBounds = bounds.Ya; // Get the latitude bounds
                        var lngBounds = bounds.Ua; // Get the longtitude bounds
                        var latDiff = Math.abs(latBounds.i - latBounds.j); // Get width of screen in coordinates
                        var lngDiff = Math.abs(lngBounds.i - lngBounds.j); // Get height of screen in coordinates

                        var fractions = 144; // Determine the amount of rectangles to divide the map into
                        var steps = Math.sqrt(fractions); // That is n by n steps, where n = sqrt(fractions)
                        var boxLatDiff = latDiff / steps; // width per box
                        var boxLngDiff = lngDiff / steps; // height per box

                        var rectangles = []; // Array of all rectangles the screen is divided into
                        for (var i = 0; i < steps; i++) { // These get the south-west bound of each rectangle
                            for (var j = 0; j < steps; j++) {
                                rectangles.push({lat: latBounds.i + boxLatDiff * i, lng: lngBounds.i + boxLngDiff * j})
                            }
                        }

                        var assignedAreas = []; // Array of areas the worker will be assigned
                        while(assignedAreas.length < 5) { // Select 5, can be set to anything you want <= fractions
                            var random = Math.floor(Math.random() * fractions); // randomly assign areas
                            if (!assignedAreas.includes(random)) assignedAreas.push(random); // randomly assign areas
                        }

                        var positioned = false; // Has street view been set to position?
                        assignedAreas.forEach(i => { // For each assigned area:
                            var startLat = rectangles[i].lat; // Get starting latitude
                            var startLng = rectangles[i].lng; // Get starting longtitude

                            that.innerCoords[that.innerCoords.length] = [{lat: startLat, lng: startLng}, // Get all outer coordinates of the box
                                {lat: startLat + boxLatDiff, lng: startLng},
                                {lat: startLat + boxLatDiff, lng: startLng + boxLngDiff},
                                {lat: startLat, lng: startLng + boxLngDiff},
                                {lat: startLat, lng: startLng}]; // First coordinate twice, otherwise line is not finished.

                            that.polygons[that.polygons.length] = new that.google.maps.Polygon({ // Make a polygon out of it
                                paths: that.innerCoords[that.innerCoords.length - 1], // Select path
                                strokeColor: '#0000FF', // Set the color of the stroke of the rectangle, can be anything you like
                                strokeOpacity: 0.3, // Opacity of stroke
                                strokeWeight: 1, // Thin or thick stroke
                                map: map, // Map object to apply it to
                                fillOpacity: 0.0 // Opacity of fill color (transparent)
                            });

                            if (!positioned) { // If position of street view not yet set.
                                that.panoPosition = { // Set street view position
                                    lat: startLat + (boxLatDiff / 2), // Center width of rectangle
                                    lng: startLng + (boxLngDiff / 2) // Center height of rectangle
                                };
                                positioned = true; // Street view is now positioned.
                            }
                        });

                        var paths = [that.outerCoords]; // Add the red overlay to the paths array.
                        that.innerCoords.forEach((o) => { // For each of the rectangles drawn above:
                            paths.push(o.reverse()) // Push the reverse of the polygons to the paths, otherwise red overlay will draw over them.
                        });

                        new that.google.maps.Polygon({ // Create and draw red overlay
                            paths: paths, // paths to draw
                            strokeWeight: 0, // stroke of the polygon
                            map: map, // Map to apply it to
                            fillColor: '#FF0000', // Color of the overlay
                            fillOpacity: 0.35 // Opacity of the fill color
                        });

                        var pano = new that.google.maps.StreetViewPanorama(that.$refs.pano, { // Initialize street view panorama
                            position: that.panoPosition, // Set to this position
                            source: that.google.maps.StreetViewSource.OUTDOOR // Use only outdoor street view (does not work for some reason...)
                        });
                        map.setStreetView(pano); // Assign panorama to the map object.

                        that.pano = pano; // Set Find.pano to the created panorama.

                        pano.addListener('position_changed', () => { // Add a listener to the panorama for changing positions, somehow always fires twices (known bug)
                            var pos = pano.getPosition(); // Get the new position

                            if (pos !== that.previousPosition) { // If the new position is not the same as the old
                                var isInBounds = false; // Moved inside designated areas?
                                for (var i = 0; i < that.polygons.length; i++) { // For each of the designated areas
                                    if (that.google.maps.geometry.poly.containsLocation(pos, that.polygons[i])) { // Check whether new position is inside
                                        isInBounds = true; // if so, true
                                        break; // break out of loop to save time and money.
                                    }
                                }

                                if (!isInBounds) { // Not in bounds?
                                    that.setSnackbarMessage("Please stay within the allocated area!"); // Warn worker using snackbar.
                                    pano.setPosition(that.previousPosition); // Move them back to their previous location.
                                } else {
                                    that.previousPosition = pos; // Update previous location.
                                }
                            }
                        });
                    });
                });
            },
            addExistingMarkers: function() { // Add markers for already existing annotations.
                var that = this; // For nested calls.
                for (var i = 0; i < that.existingSnapshots.length; i++) { // For each existing annotation.
                    var snapshot = that.existingSnapshots[i]; // Get the annotation from the array.

                    var marker = new that.google.maps.Marker({ // Initialize a marker using the API.
                        index: i, // Custom variable, set the index of the snapshot array.
                        isNewMaker: false, // It's a marker created by another worker (old).
                        position: snapshot.location, // Set the position of the marker.
                        map: that.pano, // Assign to panorama object.
                        title: 'Annotation' // Shows on hover.
                    });

                    marker.addListener('click', function () { // Add on-click listener to marker.
                        that.showMarkerContent(this.index, this.isNewMarker); // Show the snapshot belonging to the marker (index, old)
                    });
                }
            },
            showMarkerContent: function(index, isNewMarker) { // Trigger showing an existing (new or old, snapshot)
                this.snapshotIndex = index; // determine the index in array.
                this.newMarker = isNewMarker; // determine whether it's a new marker or not.
                this.showSnapshot = true; // Trigger showing the dialog.
            },
            annotateFunc: function (ev) { // Place a marker funtion.
                var overlay = this.$refs.overlay; // Select the overlay HTML object.

                // Width and height of overlay div
                var width = overlay.clientWidth; // Get width of overlay.
                var height = overlay.clientHeight; // Get height of overlay.

                // normalized x- and y-value based on the overlay div .
                // in (-1, 1) range.
                var normX = 2 * ev.offsetX / width - 1;
                var normY = 1 - 2 * ev.offsetY / height;

                var position = this.pano.getPosition(); // Get the current panorama position.
                var zoom = this.pano.getZoom(); // Get the zoom level of the street view.
                var {heading, pitch} = this.pano.getPov(); // Get the POV of the street view.
                var fov = (180 / Math.pow(2, zoom)); // Get the fov of the street view.

                var r = Raycast.createNew(heading, pitch, normX, normY, fov, width / height); // Start raycasting.
                var l = r.get_latlng(position.lat(), position.lng()); // get the coordinates for placing the marker.

                if (l === null) { // Couldn't get coordinates? Show warning.
                    this.setSnackbarMessage("The point you clicked is on a too high angle in the panorama. Please move closer and/or click on the ground.");
                } else {
                    this.latestMarker = new this.google.maps.Marker({ // Else, create new marker.
                        index: this.annotations.length, // New index.
                        isNewMarker: true, // This is a new marker, not previously made by another worker.
                        position: l, // Set the position to the just raycasted value.
                        map: this.pano, // Apply it to the panorama.
                        title: 'Annotation' // Shows on hover.
                    });

                    this.annotations[this.annotationIndex] = { // Initialize object for annotation array.
                        location: l, // Location of marker
                        position: {}, // position of street view
                        pov: {}, // pov of street view
                        First: "", // first possible b64 encoded snapshot (never empty after taking snapshot)
                        Second: "", // second possible b64 encoded snapshot
                        Third: "", // third possible b64 encoded snapshot
                        Fourth: "", // fourth possible b64 encoded snapshot
                        Fifth: "" // fifth possible b64 encoded snapshot
                    };

                    this.findStep = 2; // Move to the next step in the find task (taking snapshot)
                    this.showOverlay = false; // Stop showing overlay (circle)
                }
            },
            toggleAnnotation: async function () { // Function that toggles annotation process.
                if (this.annotating) { // If worker is annotating
                    this.showOverlay = false; // Stop showing overlay (circle)
                    this.findStep = 0; // Go back to first find step

                    if (this.latestMarker) { // If a marker was set.
                        this.latestMarker.setMap(null); // Remove it from the street view.
                        this.annotations.pop(); // Remove the last added annotation object from the array.
                    }
                } else {
                    this.findStep = 1; // Else, start annotating.
                    this.showOverlay = true; // Show the overlay (circle).
                }
            },
            takeSnapshot: function () { // Function to take a snapshot.
                this.panoPosition = this.pano.getPosition(); // Get the street view position.
                this.zoom = this.pano.getZoom(); // Get the zoom level.
                this.pov = this.pano.getPov(); // Get the pov.
                this.fov = (180 / Math.pow(2, this.zoom)); // Calculate fov.

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
                    that.imageUrl = canvas.toDataURL("image/png"); // Convert canvas content to b64.

                    that.annotations[that.annotationIndex]['position']['lat'] = that.panoPosition.lat();
                    that.annotations[that.annotationIndex]['position']['lng'] = that.panoPosition.lng();
                    that.annotations[that.annotationIndex]['pov']['heading'] = that.pov.heading;
                    that.annotations[that.annotationIndex]['pov']['pitch'] = that.pov.pitch;
                    that.annotations[that.annotationIndex]['First'] = that.imageUrl;
                    that.annotationIndex++; // Set all variables for the new annotation to their correct value.

                    that.findStep = that.annotationIndex < 5 ? 0 : 3;  // Show worker "well done" if made more that five annotations.
                    that.assignMarkerClick(); // Assign the on-click function.
                };

                image.setAttribute('crossOrigin', 'anonymous'); // Set image to be able to get from CrossOrigin.
                image.src = url; // Set the source of the image object.
            },
            assignMarkerClick: function() { // Function to add an on-click listener to the marker.
                var that = this; // For nested call.
                that.latestMarker.addListener('click', function () { // on-click listener:
                    that.showMarkerContent(this.index, this.isNewMarker); // Show snapshot for marker (index, isNew?)
                });
            },
            submit: function () { // function to submit the task.
                this.done = true; // Set done variable to true
                this.showSubmit = false; // Do not show submit dialog anymore.
                this.setFindAnnotations(this.annotations); // Update the find annotations in the store.
                this.storeFile(['findAnnotations.json', this.annotations]) // Write JSON file to system.
            },
            showHelp: function() { // Show tutorial function.
                this.setShowTutorial(true); // Set it in the store.
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
        max-width: 100vw !important;
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
        width: 320px;
        height: 320px;
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
        /*z-index: 20;*/
        width: 33%;
    }

    .submit-dialog {
        z-index: 1000 !important;
    }

    .annotation-count {
        text-align: center;
        position: absolute;
        z-index: 20;
        bottom: -15px;
        width: 140px;
        color: white;
        left: calc(150vw - 70px);
    }
</style>
<style scoped>
    .instructions {
        top: 10px;
        left: calc(100vw + 10px);
        max-height: 154px !important;
    }
</style>