const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { HotModuleReplacementPlugin }  = require("webpack");

const common_config = {
    entry:"./src/Main.ts",
    output:{
        filename:"bundle.js",
        path:path.join(__dirname,"./bin/js")
    },
    resolve:{
        extensions: ['.ts', '.js',".fs",".ts",".glsl"]
    },
    module:{
        rules:[
            {
                test: /\.(glsl|vs|fs)$/,
                loader: 'shader-loader'  
            },
            {
                test:/\.(ts|js)?$/,
                exclude:/node_modules/,
                loader:'ts-loader'
            }
        ]
    }
}

const dev_config = {
    plugins:[
        new CleanWebpackPlugin(),
        new HotModuleReplacementPlugin()
    ],
    devtool:'hidden-source-map'//'source-map'
    
}
const devServer_config = {
    devServer: {
        contentBase:'./bin',
        hot: true,
        port: 9000,
        host: "0.0.0.0",
        inline:true,
        open:false,//自动弹出
        useLocalIp: true,//是否使用本地IP
        publicPath:"/js/"
    },
    watch:true
}
const pro_config = {
}

module.exports = (env,config)=>{
    // console.log(config);
    if(config.mode == "development"){
        let $0 = config["$0"];
        if ($0.indexOf("webpack-dev-server.js")>0) {
            return Object.assign(common_config,dev_config,devServer_config);
        }else
            return Object.assign(common_config,dev_config);
    }else
        return Object.assign(common_config,pro_config);
}