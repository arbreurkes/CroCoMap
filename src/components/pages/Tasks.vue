<template>
    <div class="tasks-page">
        <md-tabs md-alignment="fixed" md-sync-route>
            <template slot="md-tab" slot-scope="{tab}">
                <span class="tab-label">
                    <md-icon class="tab-icon" v-if="tab.data.icon">{{tab.data.icon}}</md-icon> {{tab.label}}
                </span>
            </template>

            <md-tab id="tab-map" class="tab-one" md-label="Map" :md-template-data="{icon: 'map'}"
                    to="/tasks/tabOne">
                <GmapMap
                         Map
                         :center="position"
                         :zoom="18"
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
            <md-tab id="tab-two" md-label="Street View" :md-template-data="{icon: 'streetview'}"
                    to="/tasks/tabTwo">
                <div ref="pano" class="map"></div>
            </md-tab>
        </md-tabs>
        <hr class="tab-divider"/>
    </div>
</template>
<script>
    import {gmapApi} from "vue2-google-maps";
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: 'Tasks',
        components: {},
        data: function () {
            return {
                position: {lat: 0, lng: 0},
                previousPosition: this.position,
                polygons: [],
                outerCoords: [{lat: 90, lng: -90}, {lat: 90, lng: 90}, {lat: 90, lng: 180}, {lat: 90, lng: -90},
                    {lat: -90, lng: -90}, {lat: -90, lng: 180}, {lat: -90, lng: 90}, {lat: -90, lng: -90}],
                innerCoords: [{lng: 4.3583259998, lat: 52.0109693785},
                    {lng: 4.3581046768, lat: 52.0113134101},
                    {lng: 4.357844388, lat: 52.0112506756},
                    {lng: 4.3576394193, lat: 52.0115475968},
                    {lng: 4.3599021447, lat: 52.0124058491},
                    {lng: 4.3603868922, lat: 52.011960599},
                    {lng: 4.360777354, lat: 52.0119813154},
                    {lng: 4.3607659477, lat: 52.0118230383},
                    {lng: 4.3605600584, lat: 52.0117503003},
                    {lng: 4.3603482861, lat: 52.0118836737},
                    {lng: 4.3594911572, lat: 52.0115163537},
                    {lng: 4.3596133042, lat: 52.0114008894},
                    {lng: 4.3595244125, lat: 52.0113659809},
                    {lng: 4.3593954908, lat: 52.0114923702},
                    {lng: 4.3583433611, lat: 52.0110958044},
                    {lng: 4.3583865843, lat: 52.0109914234},
                    {lng: 4.3583259998, lat: 52.0109693785}]
            }
        },
        computed: {
            google: gmapApi,
            location: function () {
                return this.getLocation()
            }
        },
        watch: {
            location: function () {
                this.position = this.getCoordinates();
                this.$nextTick(() => {
                    this.initMap();
                });
            }
        },
        mounted: function () {
            this.$nextTick(() => {
                if (this.$route.path === "/tasks/") {
                    this.$router.push("/tasks/tabOne")
                }
            });
        },
        methods: {
            ...mapGetters(["getLocation", "getCoordinates", "getPosition"]),
            ...mapMutations(["setPosition"]),
            initMap: function () {
                this.$refs.mapRef.$mapPromise.then((map) => {
                    new this.google.maps.Polygon({
                        paths: this.innerCoords,
                        strokeColor: '#0000FF',
                        strokeOpacity: 0.3,
                        strokeWeight: 1,
                        map: map,
                        fillOpacity: 0.0
                    });
                    new this.google.maps.Polygon({
                        paths: [this.outerCoords, this.innerCoords.reverse()],
                        strokeWeight: 0,
                        map: map,
                        fillColor: '#FF0000',
                        fillOpacity: 0.35
                    });
                    var pano = new this.google.maps.StreetViewPanorama(this.$refs.pano, {
                        position: this.position
                    });
                    map.setStreetView(pano);

                    this.polygons[0] = new this.google.maps.Polygon({
                        paths: this.innerCoords,
                        fillColor: '#FF0000',
                        fillOpacity: 0
                    });

                    pano.addListener('position_changed', () => {
                        var pos = pano.getPosition();

                        if (pos !== this.previousPosition && !this.google.maps.geometry.poly.containsLocation(pos, this.polygons[0])) {
                            pano.setPosition(this.previousPosition);
                        } else {
                            this.previousPosition = pos;
                        }
                    });
                });
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
    }

    .tab-one {
        overflow-y: scroll;
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
</style>