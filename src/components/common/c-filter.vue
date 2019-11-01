<!-- 通用筛选项组件 -->
<template>
    <div class="search-bar">
        <el-row :gutter="10">
            <el-col :span="24/diyStyle.columnNum" v-for="f in filters" :key="f.prop">
                <p class="label" :style="labelStyle">{{f.label}}：</p>
                <el-select v-if="f.type === 'select'" v-model="filterData[f.prop]" placeholder="请选择" :loading="options[f.prop + 'Opts'].loading">
                    <el-option v-for="item in options[f.prop + 'Opts'].list" :key="item[options[f.prop + 'Opts'].value]" :label="item[options[f.prop + 'Opts'].label]" :value="item[options[f.prop + 'Opts'].value]">
                    </el-option>
                </el-select>
                <el-date-picker v-else-if="f.type === 'daterange'" v-model="filterData[f.prop]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:230px">
                </el-date-picker>
                <el-input v-else v-model="filterData[f.prop]" :placeholder="'请输入'+f.label"></el-input>
            </el-col>
            <el-button type="primary" class="button" @click="onSearch">查询</el-button>
        </el-row>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    name: 'CFilter',
    props: {
        filterData: {
            type: Object
        },
        diyStyle: {
            type: Object,
            default () {
                return {
                    columnNum: 3,
                    labelLen: 3
                }
            }
        },
        filters: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
        }
    },
    computed: {
        labelStyle () {
            return {
                width: (15 * (this.diyStyle.labelLen + 1)) + 'px'
            }
        },
        options () {
            let opts = {}
            this.filters.map(item => {
                if (item.type === 'select') {
                    opts[item.prop + 'Opts'] = {
                        list: [],
                        loading: false,
                        ...item.option
                    }
                }
            })
            return opts
        }
    },
    mounted () {
        let keys = Object.keys(this.options)
        if (keys.length > 0) {
            keys.map(item => {
                if (!_.isEmpty(this.options[item]['ajaxUrl'])) {
                    this.getOptionList(item)
                }
            })
        }
    },
    methods: {
        getOptionList (key) {
            this.options[key].loading = true
            this.options[key]['ajaxUrl']({})
                .then((res) => {
                    this.options[key].loading = false
                    this.options[key].list = res.list
                }).catch((err) => {
                    this.options[key].loading = false
                    console.log('---err:', err)
                })
        },
        onSearch () {
            this.$emit('onSearch')
        }
    }
}
</script>
<style lang="scss" scoped>
.search-bar {
    .label {
        width: 60px;
        display: inline-block;
    }
    .el-input,
    .el-select {
        display: inline-block;
        // margin-left: 10px;
        width: calc(100% - 110px);
    }
    .button {
        margin: 7px 0;
    }
}
</style>
