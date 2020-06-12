<template>
    <md-dialog :md-active="showTutorial">
        <md-tabs class="tutorial-tab-container" md-dynamic-height :md-active-tab="activeTab + ''">
            <md-tab id="0" class="tutorial-tab" md-label="Tutorial" :md-disabled="true">
                <div class="row" style="text-align: center;">
                    <h1>Welcome to CroCoMap!</h1>
                    <p>Before you are allowed to contribute, we ask you to complete this tutorial. Don't worry, you only need to do this once!</p>
                    <p>Good luck and stay safe!</p>
                    <p>The CroCoMap Team</p>
                </div>
            </md-tab>
            <md-tab id="1" class="tutorial-tab" md-label="Find task" :md-disabled=true>
                <div class="columnleft">
                    <h3>Find Task</h3>
                    <p>The goal of the Find task is to find and annotate high-risk objects.</p>
                    <p>We define a high-risk object as an object that might be touched by many different people (door handles, trash bins and park benches).</p>
                    <p>You are able to navigate through a bounded area in Google Street View. </p>
                    <p>Once you located a high-risk object, you are expected to annotate the object by clicking on it. </p>
                    <p>A pin is placed and you will be able to take a snapshot of the object by zooming in as much as needed for it to fill the screen. Click on the camera icon on the bottom to take the snapshot.</p>
                    <p>If you accidentally misclicked, you are able to remove your pin by clicking the red X on the top of your screen.</p>
                </div>
                <div class="columnright">
                    <img class="tutorial-image" src="/images/findTask.gif" alt="Image failed to load."/>
                </div>
            </md-tab>
            <md-tab id="2" class="tutorial-tab" md-label="Fix task" :md-disabled=true>
                <div class="columnleft">
                    <h3>Fix Task</h3>
                    <p>In the Fix Task, you are given an already annotated area and are asked to fix the annotations if needed. </p>
                    <p>Fixing an annotation can be done in multiple ways. First, to minimize errors in the exact location of the annotated object, you are allowed to move the ground marker of an object.</p>
                    <p>Second, if the provided snapshot is not clear, you are able to take a new one!</p>
                </div>
                <div class="columnright">
                    <img class="tutorial-image" src="/images/fixTask.gif" alt="Image failed to load."/>
                </div>
            </md-tab>
            <md-tab id="3" class="tutorial-tab" md-label="Verify task" :md-disabled=true>
                <div class="columnleft">
                    <h3>Verify Task</h3>
                    <p>In this Verify task, the goal is to find annotated objects that are high-risk and to select the annotation that is most precise and clear in terms of location and snapshot.</p>
                    <p>You will be presented with the different snapshots proposed by fellow workers and a street view panorama where the context of the objects can be seen. </p>
                    <p>You need to assess whether an annotated object is high-risk and either select the best fitting snapshot or mark the object as `No Risk’. If you really don’t know, you should select the ‘UNCERTAIN’ button.</p>
                </div>
                <div class="columnright">
                    <img class="tutorial-image" src="/images/verifyGif.gif" alt="Image failed to load."/>
                </div>
            </md-tab>
            <md-tab id="4" class="tutorial-tab" md-label="Done" :md-disabled=true style="text-align: center;">
                <h3>Well done! You should be ready to start annotating!</h3>
                <p>Good luck and stay safe!</p>
                <p>The CroCoMap Team</p>
            </md-tab>
        </md-tabs>
        <hr class="tab-underline"/>
        <md-dialog-actions>
            <md-button class="md-raised omit-button md-icon-button" @click="activeTab--" :disabled="activeTab < 1">
                <md-icon>arrow_back</md-icon>
            </md-button>
            <md-button class="md-raised vote-button md-icon-button" @click="nextButtonCall()" :disabled="activeTab === 4">
                <md-icon>arrow_forward</md-icon>
            </md-button>
            <md-button class="md-raised vote-button md-icon-button" @click="closeTutorial" :disabled="!canClose">
                <md-icon>check</md-icon>
            </md-button>
        </md-dialog-actions>
    </md-dialog>
</template>
<script>
    import {mapMutations} from "vuex";

    export default {
        name: 'Tutorial',
        components: {},
        props: {
            tutorialComplete: Boolean,
            showTutorial: Boolean
        },
        data: function () {
            return {
                activeTab: 0
            }
        },
        computed: {
            canClose: function() {
                return this.tutorialComplete || this.activeTab === 4;
            }
        },
        watch: {},
        mounted: function () {
        },
        methods: {
            ...mapMutations(['setShowTutorial', 'setTutorialComplete']),
            nextButtonCall: function () {
                if (this.activeTab < 4) {
                    this.activeTab++;
                }
            },
            closeTutorial: function() {
                this.activeTab = 0;
                this.setShowTutorial(false);
                this.setTutorialComplete(true);
            }
        }
    };
</script>
<style>
    .md-tabs-container {
        height: 100%;
    }
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
        height: 500px;
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
        margin-top: 52px;
        width: 100% !important;
        max-width: 476px !important;
        max-height: 270px !important;
    }
    .columnleft {
        float: left;
        width: 40%;
    }
    .columnright {
        text-align: center;
        float: left;
        width: 60%;
    }
    .row:after {
        content: "";
        display: table;
        clear: both;
    }
</style>