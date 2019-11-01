<!-- 通用编辑组件 -->
<template>
    <div>
        <el-dialog :title="titles[mode]" :before-close="handleClose" :visible="visible" v-bind="diyStyle">
            <div v-loading="loading">
                <el-form :model="formModel" ref="modalForm" label-suffix="：" label-width="200px">
                    <template v-for="f in fields">
                        <el-form-item :label="f.label" :key="f.prop" :prop="f.prop" :rules="mode !==2 ? {required: true, message: f.label+'不能为空', trigger: 'blur'} : {}">
                            <el-select v-if="f.type === 'select'" v-model="formModel[f.prop]" placeholder="请选择" :readonly="mode == 2" :loading="options[f.prop + 'Opts'].loading" style="width:300px">
                                <el-option v-for="item in options[f.prop + 'Opts'].list" :key="item[options[f.prop + 'Opts'].value]" :label="item[options[f.prop + 'Opts'].label]" :value="item[options[f.prop + 'Opts'].value]">
                                </el-option>
                            </el-select>
                            <el-switch v-else-if="f.type === 'switch'" v-model="formModel[f.prop]" :readonly="mode == 2" :active-value="f['active-value']" :inactive-value="f['inactive-value']">
                            </el-switch>
                            <el-input v-else-if="f.type == 'password'" v-model="formModel[f.prop]" type="password" :placeholder="'请输入'+f.label" :readonly="mode == 2" style="width:300px"></el-input>
                            <el-input v-else-if="f.type == 'textarea'" autosize v-model="formModel[f.prop]" type="textarea" :placeholder="'请输入'+f.label" :readonly="mode == 2" style="width:300px">
                            </el-input>
                            <el-input v-else v-model="formModel[f.prop]" :placeholder="'请输入'+f.label" :readonly="mode == 2" style="width:300px"></el-input>
                        </el-form-item>
                    </template>
                    <slot></slot>
                </el-form>
                <div slot="footer" class="dialog-footer" v-if="[0,1].includes(mode)">
                    <el-button @click="onClose" size="medium">取 消</el-button>
                    <el-button type="primary" @click="onSave" size="medium">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    name: 'CModal',
    components: {},
    props: {
        rowInfo: Object,
        modalVisible: Boolean,
        diyStyle: {
            type: Object,
            default () {
                return {
                    width: '50%'
                }
            }
        },

        fields: {
            type: Array,
            default () {
                return []
            }
        },
        titles: {
            type: Array,
            default () {
                return ['添加', '修改', '查看']
            }
        },
        ajaxUrls: {
            type: Object,
            default () {
                return {
                    fetch: (pms) => { },
                    add: (pms) => { },
                    update: (pms) => { },
                    delete: (pms) => { }
                }
            }
        },
        mode: Number
    },
    data () {
        let opts = {}
        this.fields.map(item => {
            if (item.type === 'select') {
                opts[item.prop + 'Opts'] = {
                    list: [],
                    loading: false
                }
            }
        })
        return {
            loading: false,
            visible: false,
            formModel: {},
            ajaxOpts: opts
        }
    },
    computed: {
        options () {
            let opts = {}
            this.fields.map(item => {
                if (item.type === 'select') {
                    if (item.option['ajaxUrl']) {
                        opts[item.prop + 'Opts'] = {
                            list: [],
                            loading: false,
                            ...item.option,
                            ...this.ajaxOpts[item.prop + 'Opts']
                        }
                    } else {
                        opts[item.prop + 'Opts'] = {
                            list: [],
                            loading: false,
                            ...item.option
                        }
                    }
                }
            })
            return opts
        }
    },
    created: function () {
        this.$on('show', function (row) {
            if (_.isEmpty(row)) {
                this.fields.map(f => {
                    let defaultValue = ''
                    if (f.default || f.default === 0 || f.default === false) {
                        defaultValue = f.default
                    }
                    this.$set(this.formModel, f.prop, defaultValue)
                })
                this.$delete(this.formModel, 'id')
            } else {
                this.fields.map((f) => {
                    let item = row[f.prop]
                    let value = ''
                    if (_.isFunction(f.render)) {
                        value = f.render(item)
                    } else {
                        value = item
                    }
                    this.$set(this.formModel, f.prop, value)
                })
                this.$set(this.formModel, 'id', row.id)
            }

            this.visible = true
        })
    },
    mounted () {
        let keys = Object.keys(this.options)
        if (keys.length > 0) {
            keys.map(item => {
                if (this.options[item]['ajaxUrl']) {
                    this.getOptionList(item)
                }
            })
        }
    },
    methods: {
        getOptionList (key) {
            this.ajaxOpts[key].loading = true
            this.options[key]['ajaxUrl']({})
                .then((res) => {
                    this.ajaxOpts[key].loading = false
                    this.ajaxOpts[key].list = res.list
                }).catch((err) => {
                    this.ajaxOpts[key].loading = false
                    console.log('---err:', err)
                })
        },
        formatSubmitModal () {
            this.fields.map((f) => {
                let item = this.formModel[f.prop]
                if (_.isFunction(f.submitRender)) {
                    this.formModel[f.prop] = f.submitRender(item)
                }
            })
        },
        submitForm (formName) {
            this.$refs[formName].validate((valid, values) => {
                if (valid) {
                    this.loading = true
                    let func = () => { }
                    if (this.mode === 0) {
                        func = this.ajaxUrls['add']
                    } else if (this.mode === 1) {
                        func = this.ajaxUrls['update']
                    }
                    this.formatSubmitModal()
                    func(this.formModel)
                        .then((res) => {
                            this.loading = false
                            this.onClose()
                            this.$emit('getData')
                        }).catch((err) => {
                            this.loading = false
                            console.log('---err:', err)
                        })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        resetForm (formName) {
            this.$refs[formName].resetFields()
        },
        onClose: function () {
            this.visible = false
            this.resetForm('modalForm')
        },
        onSave: function () {
            this.submitForm('modalForm')
        },
        handleClose: function (done) {
            this.onClose()
            done()
        }
    }
}
</script>
<style lang="scss" scoped>
.dialog-footer {
    text-align: right;
    .el-button + .el-button {
        margin-left: 20px;
    }
}
</style>
