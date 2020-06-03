<template>
    <div :class="[{'md-layout-item': inGrid}, size]">
        <md-card ref="card">
            <md-card-actions class="md-alignment-left">
                <div class="md-title">Street View</div>
                <md-icon class="info-icon">info
                    <md-tooltip md-direction="left">Street View for Context</md-tooltip>
                </md-icon>
            </md-card-actions>
            <md-card-content class="card-content">
                <gmap-street-view-panorama
                        :position="position"
                        :zoom="1"
                        :options="{
                            disableDefaultUI: true,
                            draggable: false,
                            clickableIcons: false,
                            streetViewControl: false,
                            zoomControl: false,
                            scrollWheel: false,
                            clickToGo: false,
                            panControl: false,
                            linksControl: false,
                            pov: this.pov
                        }"
                        class="pano"
                        ref="pano"
                >
                </gmap-street-view-panorama>
            </md-card-content>
        </md-card>
    </div>
</template>
<script>
    import {gmapApi} from "vue2-google-maps";

    export default {
        name: 'StreetviewCard',
        props: {
            size: String,
            inGrid: Boolean,
            position: Object,
            pov: Object
        },
        computed: {
            google: gmapApi
        },
        methods: {}
    };
</script>
<style scoped>
    .pano {
        margin: -16px 0 0 -16px;
        height: calc(100% + 24px);
        width: calc(100% + 32px);
    }
</style>