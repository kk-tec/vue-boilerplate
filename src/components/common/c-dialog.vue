<template>
    <el-dialog :title="title" :visible="visible" :width="width || '520px'" :before-close="handleBeforeClose">
        <slot></slot>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">{{btnText? btnText : '确 定'}}</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'c-dialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: String,
        btnText: String,
        width: String
    },
    data () {
        return {
        }
    },
    watch: {
        dialog (val) {
            this.visible = val
        }
    },
    methods: {
        handleClose () {
            this.$emit('cancel')
        },
        handleSubmit () {
            this.$emit('submit')
        },
        handleBeforeClose (done) {
            this.$emit('cancel')
            done()
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner,
/deep/ .el-form-item__label {
    height: 36px !important;
    line-height: 36px !important;
}

/deep/ .dialog-footer .el-button {
    width: 90px;
}
</style>
