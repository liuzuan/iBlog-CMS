<template>
    <div id="main"
         class="app-main">
        <router-view/>
    </div>
</template>

<script>
export default {
    data() {
        return {
            theme: this.$store.state.app.themeColor
        };
    },
};
</script>

<style>
    html,
    body {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>
