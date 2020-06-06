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
                class="pano" ref="pano">
        </gmap-street-view-panorama>
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
                fixIndex: 0
            }
        },
        computed: {
            google: gmapApi,
            snapshots: function() {
                return this.getFixSnapshots();
            },
            snapshotsLoaded: function () {
                return this.snapshots[0].position.lat !== 0 && this.snapshots[0].position.lng !== 0;
            }
        },
        watch: {
            google: function() {
                if (this.google !== null && this.snapshotsLoaded) this.initPano();
            },
            snapshotsLoaded: function() {
                if (this.google !== null && this.snapshotsLoaded) this.initPano();
            }
        },
        mounted: function () {
            this.loadFixSnapshots();
        },
        methods: {
            ...mapActions(['loadFixSnapshots']),
            ...mapGetters(['getFixSnapshots']),
            initPano: function() {
                this.pano = this.$refs.pano.$panoObject;

                this.initMarkers();
            },
            initMarkers: function() {
                this.snapshots.forEach(snapshot => {
                    var marker = new this.google.maps.Marker({
                        position: snapshot.location,
                        map: this.pano,
                        title: 'Annotation'
                    });

                    this.markers.push(marker);
                });

                console.log(this.markers);
            }
        }
    };
</script>
<style>
    .pano {
        height: calc(100vh - 48px);
        width: calc(100vw);
    }
</style>