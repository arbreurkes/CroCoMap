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
        <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
            <span style="width: 100%; text-align: center;">Please stay within the allocated area!</span>
        </md-snackbar>
    </div>
</template>
<script>
    import VerifyCard from "../elements/VerifyCard";
    import {mapGetters} from 'vuex'
    import StreetviewCard from "../elements/StreetviewCard";

    export default {
        name: 'Fix',
        components: {
            StreetviewCard,
            VerifyCard
        },
        data: function () {
            return {
                showSnackbar: false,
                voteIndex: 0,
                done: false
            }
        },
        computed: {
            snapShots: function () {
                return this.getSnapshots();
            },
            votes: function () {
                return this.getVerifyVotes();
            }
        },
        watch: {
            votes: function () {
                if (this.snapShots.length > this.voteIndex + 1) {
                    this.voteIndex++;
                } else {
                    this.done = true;
                }
            }
        },
        mounted: function () {
        },
        methods: {
            ...mapGetters(['getSnapshots', 'getVerifyVotes'])
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
</style>