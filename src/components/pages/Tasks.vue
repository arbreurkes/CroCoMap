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
                <TasksTabOne></TasksTabOne>
            </md-tab>
            <md-tab id="tab-two" md-label="Street View" :md-template-data="{icon: 'streetview'}"
                    to="/tasks/tabTwo">
                <TasksTabTwo></TasksTabTwo>
            </md-tab>
        </md-tabs>
        <hr class="tab-divider"/>
    </div>
</template>
<script>
    import TasksTabOne from "../tabs/TasksTabOne";
    import TasksTabTwo from "../tabs/TasksTabTwo";

    export default {
        name: 'Tasks',
        components: {
            TasksTabOne,
            TasksTabTwo
        },
        data: function () {
            return {}
        },
        props: {},
        methods: {},
        mounted: function () {
            this.$nextTick(() => {
                if (this.$route.path === "/tasks/") {
                    this.$router.push("/tasks/tabOne")
                }
            });
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
</style>