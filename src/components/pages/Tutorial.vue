<template>
    <div class="tasks-page">
        <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
            <span style="width: 100%; text-align: center;">Please stay within the allocated area!</span>
        </md-snackbar>
        <md-dialog :md-active="showDialog">
            <md-tabs class="tutorial-tab-container" md-dynamic-height :md-active-tab="activeTab + ''">
                <md-tab id="0" class="tutorial-tab" md-label="Tutorial" :md-disabled=!tutorialComplete>
                    <div class="row">
                        <h1>Welcome to CroCoMap!</h1>
                        <p>Describe the goal of CroCoMap here.</p>
                        <p>Before you are allowed to contribute, we ask you to complete this tutorial. Don't worry, you only need to this once!</p>
                        <p>Good luck and stay safe!</p>
                        <p>The CroCoMap Team</p>
                    </div>

                </md-tab>
                <md-tab id="1" class="tutorial-tab" md-label="Find task" :md-disabled=!tutorialComplete>
                    <div class="columnleft">
                        <p>The find task is as follows:</p>
                        <p>Describe goal</p>
                    </div>

                    <p>que at voluptates cupiditate. Neque quae culpa suscipit praesentium inventore ducimus ipsa aut.</p>
                </md-tab>

                <md-tab id="2" class="tutorial-tab" md-label="Fix task" :md-disabled=!tutorialComplete>
                    <div class="columnleft">
                        <p>Fix Task explanation</p>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam mollitia dolorum dolores quae commodi impedit possimus qui, atque at voluptates cupiditate. Neque quae culpa suscipit praesentium inventore ducimus ipsa aut.</p>
                    </div>
                </md-tab>
                <md-tab id="3" class="tutorial-tab" md-label="Verify task" :md-disabled=!tutorialComplete>
                    <div class="columnleft">
                        <h3>Verify Task</h3>
                        <p>In this Verify task, the goal is to find annotated objects that are high-risk and to select the annotation that is most precise and clear in terms of location and snapshot.</p>
                        <p>You will be presented with the different snapshots proposed by fellow workers and a street view panorama where the context of the objects can be seen. </p>
                        <p>You need to assesses whether an annotated object is high-risk and either select the best fitting snapshot or mark all object as `No’-Risk’. If you really don’t know, you should select the ‘UNCERTAIN’ button.</p>
                    </div>
                    <div class="columnright">
                        <img class="tutorial-image" src="/images/verifyGif.gif" alt="Image failed to load."/>
                    </div>
                </md-tab>
                <md-tab id="4" class="tutorial-tab" md-label="Done" :md-disabled=!tutorialComplete>
                    <p>Well done! You should be ready to start your first task</p>
                   </md-tab>
            </md-tabs>
            <hr class="tab-underline"/>
            <md-dialog-actions>
                <md-button class="md-raised omit-button md-icon-button" @click="activeTab--" :disabled="activeTab < 1">
                    <md-icon>arrow_back</md-icon>
                </md-button>
                <md-button class="md-raised vote-button md-icon-button" @click="nextButtonCall()">
                    <md-icon>{{rightButton}}</md-icon>
                </md-button>
            </md-dialog-actions>
        </md-dialog>

        <md-button class="md-primary md-raised" @click="showDialog = true">Show Dialog</md-button>
    </div>
</template>
<script>
    export default {
        name: 'Tutorial',
        components: {},
        data: function () {
            return {
                activeTab: 0,
                showSnackbar: false,
                showDialog: false,
                tutorialComplete: false,
            }
        },
        computed: {
            rightButton: function() {
                return this.activeTab < 4 ? "arrow_forward" : "check";
            }
        },
        watch: {},
        mounted: function () {
        },
        methods: {
            nextButtonCall: function () {
                if (this.activeTab < 4) {
                    this.activeTab++;
                } else {
                    this.activeTab = 0;
                    this.showDialog = false;
                }
            }
        }
    };
</script>
<style>
    .md-dialog-actions .md-button{
        min-width: 0;
    }

    .md-dialog-actions .md-button .md-icon {
        color: white;
    }

    .md-tabs-navigation {
        padding-left: 0 !important;
        padding-right: 0 !important;
        justify-content: space-evenly !important;
    }

    .md-tab-nav-button {
        padding-left: 0;
        padding-right: 0;
        width: 100%;
    }

    .tutorial-tab-container {
        height: 600px;
    }

    .tab-underline {
        position: absolute;
        width: 100%;
        margin-top: -1px;
        top: 48px;
    }

    .tutorial-tab {
        height: calc(100% - 48px);
        max-height: calc(100% - 48px);
    }

    .tutorial-image {
        width: 100% !important;
        /*height: 80% !important;*/
    }
    .columnleft {
        float: left;
        width: 40%;
    }
    .columnright {
        float: left;
        width: 60%;
    }
    .row:after {
        content: "";
        display: table;
        clear: both;
    }
</style>