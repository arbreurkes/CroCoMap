<template>
    <div class="content">
        <gmap-street-view-panorama class="map" :position="{lat:52.0116596, lng:4.3591061}" :zoom="1">
        </gmap-street-view-panorama>
    </div>
</template>
<script>
    import {gmapApi} from "vue2-google-maps";

    export default {
        name: 'TasksTabTwo',
        components: {},
        props: {},
        data: function () {
            return {}
        },
        computed: {
            google: gmapApi
        },
        mounted() {},
        methods: {}
    };
</script>
<style scoped>
    .map {
        margin: -16px 0 0 -16px;
        height: calc(100% + 32px);
        width: calc(100% + 32px);
    }
</style>