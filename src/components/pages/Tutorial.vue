<template>
    <div class="tasks-page">
        <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
            <span style="width: 100%; text-align: center;">Please stay within the allocated area!</span>
        </md-snackbar>
        <md-dialog :md-active.sync="showDialog">
<!--            <md-dialog-title>Task instruction</md-dialog-title>-->

            <md-tabs md-sync-route md-dynamic-height>
                <md-tab md-label="Tutorial" md-disabled=!tutComplete to="/tutorial/dialog/tabOne">
                    <h1>Welcome to CroCoMap!</h1>
                    <p>Describe the goal of CroCoMap here.</p>
                    <p>Before you are allowed to contribute, we ask you to complete this tutorial. Don't worry, you only need to this once!</p>
                    <p>Good luck and stay safe!</p>
                    <md-dialog-actions>
                        <md-button class="md-primary" to="/tutorial/dialog/tabTwo" >Start</md-button>
                    </md-dialog-actions>
                </md-tab>

                <md-tab md-label="Find task" md-disabled=!tutComplete to="/tutorial/dialog/tabTwo">
                    <p>The find task is as follows:</p>
                    <p>Describe goal</p>
                    <iframe src="https://giphy.com/embed/mhh4VA7LKYL9S" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
                    <p>que at voluptates cupiditate. Neque quae culpa suscipit praesentium inventore ducimus ipsa aut.</p>
                    <md-dialog-actions>
                        <md-button class="md-primary" to="/tutorial/dialog/tabOne" >Back</md-button>
                        <md-button class="md-primary" to="/tutorial/dialog/tabThree">Next</md-button>
                    </md-dialog-actions>
                </md-tab>

                <md-tab md-label="Fix task" md-disabled=!tutComplete to="/tutorial/dialog/tabThree">
                    <p>Fix Task explanation</p>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam mollitia dolorum dolores quae commodi impedit possimus qui, atque at voluptates cupiditate. Neque quae culpa suscipit praesentium inventore ducimus ipsa aut.</p>
                    <md-dialog-actions>
                        <md-button class="md-primary" to="/tutorial/dialog/tabTwo" >Back</md-button>
                        <md-button class="md-primary" to="/tutorial/dialog/tabFour">Next</md-button>
                    </md-dialog-actions>
                </md-tab>
                <md-tab md-label="Verify task" md-disabled=!tutComplete to="/tutorial/dialog/tabFour">
                    <p>Verify Task explanation</p>
                    <md-dialog-actions>
                        <md-button class="md-primary" to="/tutorial/dialog/tabThree">Back</md-button>
                        <md-button class="md-primary" to="/tutorial/dialog/tabFive">Next</md-button>
                    </md-dialog-actions>
                </md-tab>
                <md-tab md-label="Done" md-disabled=!tutComplete to="/tutorial/dialog/tabFive">
                    <p>Well done! You should be ready to start your first task</p>
                    <md-dialog-actions>
                        <md-button class="md-primary" to="/tutorial/dialog/tabFour">Back</md-button>
                        <md-button class="md-primary" @click="showDialog = false">Quit Tutorial</md-button>
                    </md-dialog-actions>
                   </md-tab>
            </md-tabs>

<!--            <md-dialog-actions>-->
<!--                <md-button class="md-primary" @click="showDialog = false">Close</md-button>-->
<!--                <md-button class="md-primary" @click="showDialog = false">Save</md-button>-->
<!--            </md-dialog-actions>-->
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
                showSnackbar: false,
                showDialog: false,
                tutComplete: false,
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
<style lang="scss" scoped>
    .md-dialog /deep/.md-dialog-container {
        max-width: 768px;
    }
</style>