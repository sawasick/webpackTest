## webpack で js,sass コンパイル環境の構築

### [→ 参考記事](https://www.webdesignleaves.com/pr/css/sass_webpack.html)

---

## 試した環境

- macOS10.15.7(Catalina)
- node v10.16.0

---

### **1.構築するディレクトリに移動**

### **2.package.json の生成**

```zsh
$ npm init -y
```

成功すると生成された package.json のぱすと内容が表示される

```zsh
Wrote to /Users/sawasickimac/Desktop/GitHub/webpackTest/package.json:

{
  "name": "webpackTest",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sawasick/webpackTest.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/sawasick/webpackTest/issues"
  },
  "homepage": "https://github.com/sawasick/webpackTest#readme"
}
```

### **3.wekpack のインストール**

```zsh
$ npm install -D webpack webpack-cli
```

コマンドライン操作用のパッケージは webpack-cli という別パッケージで提供されているので併せてインストールします（webpack 4.0 以降）。

オプションの -D（--save-dev）は開発環境で使うパッケージに指定するオプションです。バージョンを指定しないでインストールすると最新版がインストールされます。

下記が表示されたら OK

```zsh
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN webpackTest@1.0.0 No description

+ webpack-cli@4.7.2
+ webpack@5.47.1
added 120 packages from 156 contributors and audited 120 packages in 12.383s
found 0 vulnerabilities
```

インストールされたパッケージは node_modules というフォルダに保存され、package.json 及び package-lock.json という npm の設定ファイルが生成される。

```
.
├── node_modules  //npm でインストールされるパッケージのディレクトリ
│   ├── @types
│   ├── @webassemblyjs
│   ├── @webpack-cli
│
│    ・・・中略・・・
│
│   ├── webpack
│   ├── webpack-cli
│   ├── webpack-merge
│   ├── webpack-sources
│   ├── which
│   ├── wordwrapjs
│   └── wrappy
├── package-lock.json  //npm の設定ファイル
└── package.json  //npm の設定ファイル
```

### **4.初期構成の作成**

初期構成として下記のようにフォルダ、ファイルを作成する

```
webpackTest
├── dist  //追加する(中身は空)
├── index.html  //追加する
├── node_modules
├── package-lock.json
├── package.json
└── src  //追加する
      └── javascripts  //追加する
      |     └── index.js //追加する
      └── stylesheets  //追加する
            └── main.scss //追加する
```

index.js に以下を記述

```javascript
// スタイルシートの読み込み
import '../stylesheets/main.scss';
```

index.html のスタイル,スクリプトの読み込みは以下のパス

```html
<link rel="stylesheet" href="dist/main.css" />

<script type="text/javascript" src="dist/main.js" defer></script>
```

### **5.ローダーとプラグインのインストール**

以下のローダーとプラグインをインストールする

- css-loader：CSS を処理するためのモジュール
- sass-loader：Sass を CSS へ変換するためのモジュール
- sass：Sass をコンパイルするためのモジュール（Dart Sass）
- MiniCssExtractPlugin：CSS を別ファイルとして出力するためのプラグイン

```zsh
$ npm install --save-dev css-loader sass-loader sass mini-css-extract-plugin
```

以下のように表示されたら OK

```zsh
+ sass-loader@12.1.0
+ css-loader@6.2.0
+ mini-css-extract-plugin@2.1.0
+ sass@1.37.0
added 35 packages from 72 contributors and audited 155 packages in 5.331s
found 0 vulnerabilities
```

package.json が以下のようになっている

```json
{
	"name": "webpackTest",
	"version": "1.0.0",
	"description": "",
	"main": "index.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1"
	},
	"keywords": [],
	"author": "",
	"license": "ISC",
	"devDependencies": {
		"css-loader": "^5.0.1",
		"mini-css-extract-plugin": "^1.3.0",
		"sass": "^1.29.0",
		"sass-loader": "^10.0.5",
		"webpack": "^5.4.0",
		"webpack-cli": "^4.2.0"
	}
}
```

オプションで fibers パッケージをインストール
(コンパイル速度が早くなるらしい)

```zsh
$ npm install --save-dev fibers
```

### **6.webpack.config.js を作成**

```
webpackTest
├── dist
├── index.html
├── node_modules
├── package-lock.json
├── package.json
├── src(配下は略)
└── webpack.config.js   // 作成
```

webpack.config.js に以下の内容を記述

```javascript
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
```

ローダーの処理の大まかな流れ

- sass-loader を使って Sass を CSS へ変換
- css-loader で CSS を JavaScript（CommonJS） に変換
- MiniCssExtractPlugin.loader で CSS を 抽出して別ファイルとして出力

### **7.npm script の準備**

package.json の script フィールドのコマンドを追加

```json
~~
"scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development",
    "watch": "webpack --mode development --watch",
    "sass-ver": "sass --version"
  },
~~
```

### **8.コンパイル**

コンパイルを実行

```zsh
$ npm run build
```

成功すると dist フォルダに main.css と main.js が生成される

npm run build は出力されるファイルが compressed で出力される
npm run dev は expanded(普通の形)で出力される
npm run watch はファイル変更が監視されて自動で dev モードでリビルドされる(終了は control + c)
