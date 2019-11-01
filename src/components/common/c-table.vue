<!-- 通用增删查改表格组件 -->
<template>
    <div>
        <c-filter v-if="hasFilter" :filterData="filterData" :filters="filters" :diyStyle="styleOpts.filter" @onSearch="onSearch"></c-filter>
        <el-button v-if="actions.includes('c')" type="primary" class="fr" @click="handleAdd">{{addLabel}}</el-button>
        <el-table :data="dataList" v-loading="loading" style="width: 100%">
            <template v-for="c in columns">
                <el-table-column :key="c.prop" :prop="c.prop" :label="c.label">
                    <template slot-scope="{row}">
                        <span v-if="c.type=='date'">
                            {{row[c.prop] | dateFormat}}
                        </span>
                        <span v-else>
                            {{renderColumn(row,c.prop)}}
                        </span>
                    </template>
                </el-table-column>
            </template>
            <el-table-column fixed="right" label="操作" width="180">
                <template slot-scope="{row}">
                    <el-button v-if="actions.includes('i')" @click="handleView(row)" type="text">查看</el-button>
                    <el-button v-if="actions.includes('u')" @click="handleEdit(row)" type="text">修改</el-button>
                    <el-button v-if="actions.includes('d')" @click="handleDelete(row[keyId])" type="text">删除</el-button>
                    <slot name="opts" :row="row"></slot>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-if="hasPagination" class="fr" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageInfo.pageNo" :page-size.sync="pageInfo.pageSize" :page-sizes="pageInfo.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <c-modal v-if="hasModal" :mode="mode" :fields="fields" ref="modal" :ajaxUrls="ajaxUrls" @getData="getData" :diyStyle="styleOpts.modal">
            <slot :row="rowInfo"></slot>
        </c-modal>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    name: 'CTable',
    props: {
        addLabel: String,
        actions: {
            type: Array,
            default () {
                return []// ['c', 'r', 'u', 'd']，c:新增，r:列表，u:修改，d:删除，i:详情
            }
        },
        columns: {
            type: Array,
            default () {
                return []
            }
        },
        hasPagination: {
            type: Boolean,
            default: true
        },
        keyId: {
            type: String,
            default: 'id'
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
        fields: {
            type: Array,
            default () {
                return []
            }
        },
        filters: {
            type: Array,
            default () {
                return []
            }
        },
        styleOpts: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        let model = {}
        this.filters.map(item => {
            let defaultValue = ''
            switch (item.type) {
                case 'input':
                    defaultValue = ''
                    break
                default:
                    break
            }
            if (item.default || item.default === 0) {
                defaultValue = item.default
            }
            model[item.prop] = defaultValue
        })
        return {
            mode: -1,
            loading: false,
            dataList: [],
            total: 0,
            rowInfo: {},
            filterData: model,
            fData: {}
        }
    },
    computed: {
        pageInfo () {
            return this.pagination || {
                pageNo: 1,
                pageSize: 10,
                pageSizes: [10, 20, 50, 100]
            }
        },
        hasFilter () {
            return !_.isEmpty(this.filters)
        },
        hasModal () {
            return !_.isEmpty(this.fields)
        }
    },
    created: function () {
        this.$on('refresh', function () {
            this.onSearch()
        })
    },
    mounted () {
        this.onSearch()
    },
    methods: {
        getColumnVal (row, propNames) {
            let currVal = row
            propNames.forEach(p => {
                currVal = currVal[p]
            })
            return currVal
        },
        renderColumn (row, prop) {
            let colItem = this.columns.find((value, index) => {
                return value.prop === prop
            })
            if (_.isFunction(colItem.render)) {
                return colItem.render(row[prop])
            } else if (prop.includes('.')) {
                let colProps = prop.split('.')
                let val = this.getColumnVal(row, colProps)
                return val
            } else {
                return row[prop]
            }
        },
        handleSizeChange (val) {
            this.pageInfo.pageSize = val
            this.onSearch()
        },
        handleCurrentChange (val) {
            this.pageInfo.pageNo = val
            this.onSearch()
        },
        onSearch () {
            let { filterData } = this
            let fData = {}
            Object.keys(filterData).forEach(key => {
                if (key.includes(',')) {
                    let itemKeys = key.split(',')
                    let filterItem = this.filters.find(function (value, index, arr) {
                        return value.prop === key
                    })
                    itemKeys.forEach((k, i) => {
                        // 目前只考虑了 key: [v1,v2] 的情况
                        if (filterItem.type.includes('date')) {
                            let val = ''
                            if (filterData[key] && filterData[key][i]) {
                                if (i === 1) {
                                    val = +filterData[key][i] + 86399000
                                } else {
                                    val = +filterData[key][i]
                                }
                            }
                            fData[k] = val
                        } else {
                            fData[k] = filterData[key][i]
                        }
                    })
                } else {
                    fData[key] = filterData[key]
                }
            })
            // console.log('----fData:', fData)
            this.fData = fData
            this.getData()
        },
        getData () {
            const { pageNo, pageSize } = this.pageInfo
            this.loading = true
            let payload = {}
            if (this.hasPagination) {
                payload = {
                    ...payload,
                    pageNo,
                    pageSize
                }
            }
            if (!_.isEmpty(this.fData)) {
                payload = {
                    ...payload,
                    ...this.fData
                }
            }
            this.ajaxUrls['fetch'](payload)
                .then((res) => {
                    this.loading = false
                    this.dataList = res.list
                    this.total = res.total
                    // console.log('-----table list:', this.dataList)
                }).catch((err) => {
                    this.loading = false
                    console.log('---err:', err)
                })
        },
        handleAdd () {
            this.mode = 0
            this.$refs.modal.$emit('show')
        },
        handleEdit (row) {
            this.mode = 1
            this.rowInfo = _.cloneDeep(row)
            this.$refs.modal.$emit('show', row)
        },
        handleView (row) {
            this.mode = 2
            this.rowInfo = _.cloneDeep(row)
            this.$refs.modal.$emit('show', row)
        },
        handleDelete (id) {
            this.$confirm('是否确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ajaxUrls['delete']({ id })
                    .then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.onSearch()
                    }).catch(_ => { })
            })
        }
    }
}
</script>
