<template>
    <div class="tasks-page">
        <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
            <span style="width: 100%; text-align: center;">Please stay within the allocated area!</span>
        </md-snackbar>
    </div>
</template>
<script>
    export default {
        name: 'Tutorial',
        components: {},
        data: function () {
            return {
                showSnackbar: false
            }
        },
        computed: {
        },
        watch: {
        },
        mounted: function () {
        },
        methods: {
        }
    };
</script>
<style>
</style>