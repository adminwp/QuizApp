const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const myConfig = {
	mode: 'development',
	devtool: 'source-map',
	target: 'web',
	entry: path.resolve(__dirname, 'src', 'app.js'),
	output: {
		filename: 'app.js',
		chunkFilename: '[id].js',
		clean: true,
		path: path.resolve(__dirname, 'build'),
	},

	resolve: {
		extensions: ['.js', '.json', '.jsx'],
	},

	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					compress: true,
					ecma: true,
					sourceMap: true,
					format: {
						comments: false,
					},
				},
				extractComments: false,
			}),
		],
	},

	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},

			// {
			// 	test: /\.s[ac]ss$/i,
			// 	use: [
			// 		// // Creates `style` nodes from JS strings
			// 		'style-loader',
			// 		// // Translates CSS into CommonJS
			// 		'css-loader',
			// 		'sass-loader',
			// 	],
			// },

			// {
			// 	test: /\.s[ac]ss$/i,
			// 	use: [
			// 		{
			// 			loader: 'file-loader',
			// 			options: { outputPath: 'css/', name: '[name].css' },
			// 		},
			// 		'sass-loader',
			// 	],
			// },

			{
				test: /\.s[ac]ss$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},

			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
					},
				],
			},

			{
				type: 'javascript/auto',
				test: /\.json$/i,
				exclude: /(node_modules)/,
				use: [
					{
						loader: 'file-loader',
						options: { name: '[name].[ext]' },
					},
				],
			},

			// {
			// 	test: /\.js$/,
			// 	include: path.resolve(__dirname, 'src'),
			// 	loader: 'jsx-vanilla-loader',
			// },

			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},

	devServer: {
		contentBase: path.resolve(__dirname, 'build'),
		compress: true,
		port: 8000,
		open: true,
		liveReload: true,
	},

	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			minify: true,
			template: path.resolve(__dirname, 'src', 'index.html'),
		}),

		new MiniCssExtractPlugin({
			linkType: 'text/css',
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
	],
};

module.exports = myConfig;
