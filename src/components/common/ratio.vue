<!-- 环比组件 -->
<template>
    <span :class="'ratio-txt ' + clsArr[sign]">{{label}}<i :class="iconArr[sign]"></i></span>
</template>

<script>
export default {
    props: ['ratio'],
    data() {
        return {
            clsArr: ['empty', 'up', 'down', 'equal'],
            iconArr: ['', 'v-icon-up', 'v-icon-down', '']
        }
    },
    computed: {
        label() {
            let { ratio } = this
            if (!ratio && ratio !== 0) {
                return '--'
            }
            let label = ratio > 0
                ? (ratio * 100).toFixed(1) + '%'
                : ratio < 0 ? (Math.abs(ratio) * 100).toFixed(1) + '%' : '持平'
            return label
        },
        sign() {
            let { ratio } = this
            if (!ratio && ratio !== 0) {
                return 0
            }
            let sign = ratio > 0
                ? 1
                : ratio < 0 ? 2 : 3
            return sign
        }
    }
}
</script>

<style lang="scss">
@import "@/assets/styles/index.scss";

.ratio-txt {
    width: auto;
    height: hpx2rem(78);
    line-height: hpx2rem(65);
    font-size: wpx2rem(32);
    padding: hpx2rem(3) wpx2rem(8);
    display: inline-block;
}
.empty {
    color: #fff;
    border-color: #fff;
}
.up {
    color: #ff0060;
    border-color: #ff0060;
}
.down {
    color: #18fcff;
    border-color: #18fcff;
}
.equal {
    color: #ffea37;
    border-color: #ffea37;
}
</style>
