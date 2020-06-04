<template>
    <div class="verify-page">
        <div v-if="!done">
            <div class="md-layout md-gutter">
                <streetview-card :position="this.snapShots[voteIndex]['location']" :pov="this.snapShots[voteIndex]['pov']" :inGrid="true" size="md-size-33"></streetview-card>
                <verify-card title="First" :image="this.snapShots[voteIndex]['First']" :index="voteIndex" :inGrid="true"
                             size="md-size-33"></verify-card>
                <verify-card title="Second" :image="this.snapShots[voteIndex]['Second']" :index="voteIndex" :inGrid="true"
                             size="md-size-33"></verify-card>
            </div>
            <div class="md-layout md-gutter">
                <verify-card title="Third" :image="this.snapShots[voteIndex]['Third']" :index="voteIndex" :inGrid="true"
                             size="md-size-33"></verify-card>
                <verify-card title="Fourth" :image="this.snapShots[voteIndex]['Fourth']" :index="voteIndex" :inGrid="true"
                             size="md-size-33"></verify-card>
                <verify-card title="Fifth" :image="this.snapShots[voteIndex]['Fifth']" :index="voteIndex" :inGrid="true"
                             size="md-size-33"></verify-card>
            </div>
        </div>
        <md-empty-state
                v-if="done"
                class="verify-empty"
                md-icon="verified"
                md-label="All set!"
                md-description="You have completed your verify tasks for now. Thank you!">
        </md-empty-state>
        <md-dialog :md-active="uncertainPrompt">
            <md-dialog-title class="dialog-title dialog-title-custom">I don't know.</md-dialog-title>
            <md-dialog-content class="dialog-content dialog-content-custom">
                <md-empty-state
                        md-icon="help_outline"
                        md-description="Only use this options if you really do not know whether this object is potentially risky.">
                    <span class="button-span">
                        <md-button class="vote-button md-raised" @click="uncertain()">Confirm</md-button>
                        <md-button class="omit-button md-raised" @click="uncertainPrompt = false">CANCEL</md-button>
                    </span>
                </md-empty-state>
            </md-dialog-content>
        </md-dialog>
        <md-dialog :md-active="omitPrompt">
            <md-dialog-title class="dialog-title dialog-title-custom">Is this object not risky?</md-dialog-title>
            <md-dialog-content class="dialog-content dialog-content-custom">
                <md-empty-state
                        md-icon="remove_circle_outline"
                        md-description="If you mark this object as not risky, you will not be able to vote on the other snapshots.">
                    <span class="button-span">
                        <md-button class="vote-button md-raised" @click="omit()">Confirm</md-button>
                        <md-button class="omit-button md-raised" @click="omitPrompt = false">CANCEL</md-button>
                    </span>
                </md-empty-state>
            </md-dialog-content>
        </md-dialog>
        <md-snackbar class="vote-snackbar" md-position="center" :md-duration="Infinity" :md-active="!done" md-persistent>
            <span style="width: 100%; text-align: center;">
                <md-button class="unct-button md-raised" @click="uncertainPrompt = true">UNCERTAIN</md-button>
                <md-button class="omit-button md-raised" @click="omitPrompt = true">NO RISK</md-button>
            </span>
        </md-snackbar>
    </div>
</template>
<script>
    import VerifyCard from "../elements/VerifyCard";
    import {mapActions, mapGetters} from 'vuex'
    import StreetviewCard from "../elements/StreetviewCard";

    export default {
        name: 'Fix',
        components: {
            StreetviewCard,
            VerifyCard
        },
        data: function () {
            return {
                voteIndex: 0,
                done: false,
                uncertainPrompt: false,
                omitPrompt: false,
            }
        },
        computed: {
            snapShots: function () {
                return this.getVerifySnapshots();
            },
            votes: function () {
                return this.getVerifyVotes();
            }
        },
        watch: {
            snapShots: function () {
                this.done = this.snapShots.length === 0;
            },
            votes: {
                immediate: true,
                handler: function () {
                    if (this.snapShots.length === 0) {
                        this.done = true;
                    } else if (this.snapShots.length > this.voteIndex + 1) {
                        this.voteIndex++;
                    } else {
                        this.done = true;
                    }
                }
            }
        },
        mounted: function () {
            this.loadVerifySnapshots();
        },
        methods: {
            ...mapActions(['updateVerifyVotes', 'loadVerifySnapshots']),
            ...mapGetters(['getVerifySnapshots', 'getVerifyVotes']),
            uncertain: function () {
                this.updateVerifyVotes("?");
                this.uncertainPrompt = false;
            },
            omit: function () {
                this.updateVerifyVotes(null);
                this.omitPrompt = false;
            }
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

    .md-icon {
        font-family: 'Material Icons Outlined';
    }

    .md-layout {
        margin-bottom: 16px;
    }

    .dialog-title-custom {
        text-align: center;
        margin-bottom: 0;
    }

    .dialog-content-custom {
        padding-bottom: 0;
    }

    .vote-snackbar {
        width: 33%;
    }

    .button-span {
        width: 100%;
        justify-content: center;
    }

    .md-snackbar-content .md-button:first-child {
        margin-left: -4px !important;
        /*margin-right: 4px !important;*/
    }

    .button-span .vote-button, .button-span .unct-button, .button-span .omit-button {
        margin-left: 4px !important;
        margin-right: 4px !important;
    }
</style>