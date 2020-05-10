<template>
    <div class="content">
        <md-empty-state
                v-if="true"
                md-icon="stars"
                md-label="No Content Yet!"
                md-description="This is an empty state, indicating that no content has been loaded for this page.
                If you see this text, it means that this page has not yet been implemented.">
            <md-button class="md-primary md-raised empty-state-button" to="/">Home</md-button>
        </md-empty-state>
        <div class="md-layout md-gutter">
        </div>
    </div>
</template>
<script>
    export default {
        name: 'TasksTabOne',
        components: {},
        props: {},
        data: function () {
            return {}
        },
        computed: {},
        methods: {}
    };
</script>
<style scoped>
</style>