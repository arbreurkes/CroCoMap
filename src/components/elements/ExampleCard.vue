<template>
    <div :class="[{'md-layout-item': inGrid}, size]">
        <md-card ref="card">
            <md-card-actions class="md-alignment-left">
                <div class="md-title">{{title}}</div>
                <md-icon class="info-icon">info
                    <md-tooltip md-direction="left">{{title}}</md-tooltip>
                </md-icon>
            </md-card-actions>
            <md-card-content class="card-content">
                <md-empty-state
                        v-if="true"
                        md-icon="stars"
                        md-label="No Content Yet!"
                        md-description="This is an empty state, indicating that no content has been loaded for this page.
                        If you see this text, it means that this page has not yet been implemented.">
                </md-empty-state>
            </md-card-content>
        </md-card>
    </div>
</template>
<script>
    export default {
        name: 'ExampleCard',
        props: {
            title: String,
            size: String,
            inGrid: Boolean
        },
        computed: {},
        methods: {}
    };
</script>