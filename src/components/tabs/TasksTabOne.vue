<template>
    <div class="content">
        <GmapMap
                Map
                :center="{lat:52.0116596, lng:4.3591061}"
                :zoom="18"
                :options="{
                    disableDefaultUI: true,
                    draggable: false,
                    clickableIcons: false
                    // mapTypeControl: false,
                    // fullscreenControl: false,
                    // streetViewControl: false,
                }"
                map-type-id="terrain"
                class="map"
                ref="mapRef"
        >
            <!--            <gmap-polygon :paths="outerCoords"></gmap-polygon>-->
        </GmapMap>
    </div>
</template>
<script>
    import {gmapApi} from 'vue2-google-maps'

    export default {
        name: 'TasksTabOne',
        components: {},
        props: {},
        data: function () {
            return {
                outerCoords: [{lat: 90,lng:-90},{lat: 90,lng: 90},{lat: 90,lng:180},{lat: 90,lng:-90},
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
            google: gmapApi
        },
        mounted() {
            this.$nextTick(() => {
                this.coverMap();
            })
        },
        methods: {
            coverMap: function () {
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
                });
            }
        }
    };
</script>
<style scoped>
    :root {
        padding: 0;
    }

    .map {
        margin: -16px 0 0 -16px;
        height: calc(100% + 32px);
        width: calc(100% + 32px);
    }
</style>