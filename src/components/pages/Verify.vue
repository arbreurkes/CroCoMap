<template>
    <div class="verify-page">
        <div class="md-layout md-gutter">
            <verify-card title="First" :image="this.snapShots['First']" :inGrid="true" size="md-size-33"></verify-card>
            <verify-card title="Second" :image="this.snapShots['Second']" :inGrid="true" size="md-size-33"></verify-card>
            <verify-card title="Third" :image="this.snapShots['Third']" :inGrid="true" size="md-size-33"></verify-card>
        </div>
        <div class="md-layout md-gutter">
            <verify-card title="Fourth" :image="this.snapShots['Fourth']" :inGrid="true" size="md-size-33"></verify-card>
            <verify-card title="Fifth" :image="this.snapShots['Fifth']" :inGrid="true" size="md-size-33"></verify-card>
            <verify-card title="Sixth" :image="this.snapShots['Sixth']" :inGrid="true" size="md-size-33"></verify-card>
        </div>
        <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
            <span style="width: 100%; text-align: center;">Please stay within the allocated area!</span>
        </md-snackbar>
    </div>
</template>
<script>
    import VerifyCard from "../elements/VerifyCard";
    import {mapGetters} from 'vuex'

    export default {
        name: 'Fix',
        components: {
            VerifyCard
        },
        data: function () {
            return {
                showSnackbar: false
            }
        },
        computed: {
            snapShots: function () {
                return this.getSnapshots();
            }
        },
        watch: {
        },
        mounted: function () {
        },
        methods: {
            ...mapGetters(['getSnapshots'])
        }
    };
</script>
<style>
    .verify-page {
        width: 100%;
        padding: 16px;
        height: calc(100vh - 48px);
        overflow-y: scroll;
    }

    .md-layout {
        margin-bottom: 16px;
    }
</style>