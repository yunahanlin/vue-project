<template>
    <mu-appbar class="HeaderBar">
        <img class="logo" src="../assets/logo.png" alt="">
        <mu-icon-button icon="send" to="/vue-home/dist/publish" slot="right"></mu-icon-button>
    </mu-appbar>
</template>

<style lang="scss" scoped>
    .HeaderBar {
        position: fixed;
        top: 0;
        height: 0.4rem;
        .logo {
            width: 0.4rem;
            height: 0.4rem;
            position:absolute;
            left:0;
            top:0;
        }
    }
</style>
