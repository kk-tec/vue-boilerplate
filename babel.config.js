module.exports = {
    plugins: [ // 插件配置
        'equire',
        [
            'component',
            {
                'libraryName': 'element-ui',
                'styleLibraryName': 'theme-chalk'
            }
        ]
    ],
    presets: [ // 预设配置
        [
            '@vue/app',
            {
                polyfills: ['es6.promise', 'es6.symbol']
            }
        ]
    ]
}
