const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
//const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const MinifyPlugin = require("babel-minify-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: 'development',
    //devtool: 'inline-source-map',
    devtool: false,
    entry: './src/app.js',
    //watch: true,
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin()
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require('sass'),

                            webpackImporter: false,
                            sassOptions: {
                                includePaths: ['./node_modules']
                            },
                        }
                    }
                ]
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: [
                    'raw-loader',
                    'glslify-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    esModule: false,
                    outputPath: 'assets'
                }
                // use: [
                //     { loader: 'url-loader' }
                // ]
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                }
            },
            
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        // new HtmlWebpackPlugin({
        //     title: 'Webpack starter project',
        //     template: path.resolve('./src/index.html')
        // }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        //new MinifyPlugin()
    ]
};