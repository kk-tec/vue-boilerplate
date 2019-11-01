<template>
    <div id="app">
        <router-view />
    </div>
</template>

<style lang="scss">
@import "./assets/css/reset.css";
@import "./assets/css/font.css";
@import "./assets/iconfont/iconfont.css";
@import "./assets/styles/index.scss";

[class^="v-icon-"],
[class*=" v-icon-"] {
    font-family: "iconfont" !important;
    font-size: wpx2rem(16);
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
* {
    margin: 0;
    padding: 0;
}
html {
    overflow: hidden;
}
body {
    overflow: hidden;
}
</style>
