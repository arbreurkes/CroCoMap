<template>
    <div class="content">
        <md-empty-state
                v-if="false"
                md-icon="stars"
                md-label="No Content Yet!"
                md-description="This is an empty state, indicating that no content has been loaded for this page.
                If you see this text, it means that this page has not yet been implemented.">
            <md-button class="md-primary md-raised empty-state-button" to="/">Home</md-button>
        </md-empty-state>
        <div class="md-layout md-gutter">
            <ExampleCard title="Example Card" :in-grid="true" size="md-size-33"></ExampleCard>
        </div>
    </div>
</template>
<script>
    import ExampleCard from "../elements/ExampleCard";

    export default {
        name: 'TasksTabTwo',
        components: {ExampleCard},
        props: {},
        data: function () {
            return {}
        },
    };
</script>
<style scoped>
</style>