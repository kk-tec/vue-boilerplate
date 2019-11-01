import Vue from 'vue'
import {
    Loading,
    Message
} from 'element-ui'

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message