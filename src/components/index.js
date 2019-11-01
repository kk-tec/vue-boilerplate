let components = []
// 批量加载所有全局组件
let importAll = r => {
    r.keys().forEach(item => {
        components.push(r(item))
    })
}

importAll(require.context('./common', true, /\.vue$/))

const install = function(Vue, opts = {}) {
    components.forEach(component => {
        Vue.component(component.default.name, component.default)
    })
}

export default Object.assign(components, {
    install
})
