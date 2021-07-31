//path モジュールの読み込み
const path = require('path');
//MiniCssExtractPlugin の読み込み
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	//エントリポイント（デフォルトと同じなので省略可）
	entry: './src/javascripts/index.js',
	//出力先（デフォルトと同じなので省略可）
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				// 対象となるファイルの拡張子(scss)
				test: /\.scss$/,
				// Sassファイルの読み込みとコンパイル
				use: [
					// CSSファイルを抽出するように MiniCssExtractPlugin のローダーを指定
					{
						loader: MiniCssExtractPlugin.loader,
					},
					// CSSをバンドルするためのローダー
					{
						loader: 'css-loader',
						options: {
							//URL の解決を無効に
							url: false,
							// ソースマップを有効に
							sourceMap: false,
						},
					},
					// Sass を CSS へ変換するローダー
					{
						loader: 'sass-loader',
						options: {
							// dart-sass を優先
							implementation: require('sass'),
							sassOptions: {
								// fibers を使わない場合は以下で false を指定
								fiber: require('fibers'),
							},
							// ソースマップを有効に
							sourceMap: false,
						},
					},
				],
			},
		],
	},
	//プラグインの設定
	plugins: [
		new MiniCssExtractPlugin({
			// 抽出する CSS のファイル名
			filename: 'main.css',
		}),
	],
	//source-map タイプのソースマップを出力
	// devtool: 'source-map',
	// node_modules を監視（watch）対象から除外
	watchOptions: {
		ignored: /node_modules/, //正規表現で指定
	},
};
