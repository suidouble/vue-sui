module.exports = {
    // config for building demo app
    // deployed : https://suidouble.github.io/vue-sui/
    publicPath: ".",
    configureWebpack: config => {
        if (config.output && config.output.libraryTarget && config.output.libraryTarget == 'umd') {
            if (!config.externals) {
                config.externals = {};
            }
            config.externals.suidouble = {
                commonjs: 'suidouble',
                commonjs2: 'suidouble',
                amd: 'suidouble',
                root: 'suidouble'
            };
        }


    },
};