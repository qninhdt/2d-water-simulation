const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: './src/index.ts',
    devServer: {
        static: [
            { directory: path.join(__dirname, 'public') },
            { directory: path.join(__dirname, 'dist') },
        ],
        compress: true,
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'esbuild-loader',
                options: {
                    loader: 'ts',
                    target: 'es2015',
                    tsconfigRaw: require('./tsconfig.json')
                }
            },
            {
                test: /\.js$/,
                loader: 'esbuild-loader',
                options: {
                    loader: 'js',
                    target: 'es2015'
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(frag|vert)$/i,
                use: 'raw-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css', '.frag', '.vert'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@assets': path.resolve(__dirname, 'assets'),
        }
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimizer: [
            new ESBuildMinifyPlugin({
                target: 'es2015',
                css: true
            })
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css'
        })
    ],
};