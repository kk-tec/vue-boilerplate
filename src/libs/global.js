
import ajax from './ajax'
import util from './util'

export default function(Vue, opts) {
    // 全局ajax
    Vue.prototype.$ajax = ajax
    Vue.prototype.$util = util
}
