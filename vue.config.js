module.exports = {
    outputDir: '../static-build/vue-project',
    assetsDir: './static',
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack: config => {
        const resolve = dir => require('path').join(__dirname, dir)
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('libs', resolve('src/libs'))
            .set('store', resolve('src/store'))
            .set('views', resolve('src/views'))
    },
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        open: false,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3000', // 可修改为开发IP
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
