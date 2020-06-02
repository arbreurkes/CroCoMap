<template>
    <div :class="[{'md-layout-item': inGrid}, size]">
        <md-card ref="card">
            <md-card-actions class="md-alignment-left">
                <div class="md-title">{{title}} Annotation</div>
                <md-icon class="info-icon">info
                    <md-tooltip md-direction="left">{{title}} Annotation Snapshot</md-tooltip>
                </md-icon>
            </md-card-actions>
            <md-card-content class="card-content">
                <div v-if="image !== ''" class="img-container">
                    <img class="img-img" :src="image" alt="Image failed to load."/>
                </div>
                <md-empty-state
                        v-if="image === ''"
                        md-icon="track_changes"
                        :md-label="'No ' + title + ' Annotation'">
                </md-empty-state>
            </md-card-content>
            <md-card-actions v-if="image !== ''" class="actions">
                <md-button class="vote-button md-raised" @click="verifyPrompt = true">VOTE</md-button>
                <md-button class="omit-button md-raised" @click="omitPrompt = true">NO RISK</md-button>
            </md-card-actions>
        </md-card>
        <md-dialog :md-active="verifyPrompt">
            <md-dialog-title class="dialog-title">Confirm Your Choice</md-dialog-title>
            <md-dialog-content class="dialog-content">
                <md-empty-state
                        md-icon="check_circle_outline"
                        md-description="Are you sure you wish to vote for this annotation? You may only pick one.">
                    <span class="button-span">
                        <md-button class="vote-button md-raised" @click="verify()">Confirm</md-button>
                        <md-button class="omit-button md-raised" @click="verifyPrompt = false">CANCEL</md-button>
                    </span>
                </md-empty-state>
            </md-dialog-content>
        </md-dialog>
        <md-dialog :md-active="omitPrompt">
            <md-dialog-title class="dialog-title">Is this object not risky?</md-dialog-title>
            <md-dialog-content class="dialog-content">
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
    </div>
</template>
<script>
    import {mapActions} from 'vuex';

    export default {
        name: 'VerifyCard',
        props: {
            title: String,
            size: String,
            inGrid: Boolean,
            image: String,
            index: Number
        },
        data: function() {
          return {
              verifyPrompt: false,
              omitPrompt: false,
              selectedAnnotation: null
          }
        },
        computed: {},
        methods: {
            ...mapActions(['updateVerifyVotes']),
            verify: function() {
                this.updateVerifyVotes(this.title);
                this.verifyPrompt = false;
            },
            omit: function () {
                this.updateVerifyVotes(null);
                this.omitPrompt = false;
            }
        }
    };
</script>
<style scoped>
    .card-content {
        height: calc(100% - 100px) !important;
    }

    .img-container {
        text-align: center;
        height: 100%;
        max-height: 200px;
        overflow: hidden;
    }

    .img-img {
        height: 100%;
    }

    .button-span {
        width: 100%;
    }

    span .vote-button, span .omit-button {
        margin-left: 4px;
        margin-right: 4px;
    }

    .vote-button, .omit-button {
        color: white !important;
    }

    .vote-button {
        background-color: var(--forest-green) !important;
    }

    .omit-button {
        background-color: #d32f2f !important;
    }

    .actions {
        justify-content: center !important;
    }

    .dialog-title {
        text-align: center;
        margin-bottom: 0;
    }

    .dialog-content {
        padding-bottom: 8px;
    }
</style>