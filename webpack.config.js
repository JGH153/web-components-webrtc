const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
  },
  target: "web", // needed or live reload fails
  // devtool: "inline-source-map",
  devServer: {
    contentBase: "dist",
    publicPath: "/",
    open: true,
    hot: false,
    liveReload: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.html$/i,
        use: ["raw-loader"],
      },
      {
        test: /\.css$/i,
        use: ["raw-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html", // template file
      filename: "index.html", // output file
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/assets", to: "assets" },
        { from: "src/styles.css", to: "styles.css" },
        { from: "src/index.css", to: "index.css" },
        { from: "src/normalize.css", to: "normalize.css" },
      ],
    }),
  ],
  optimization: {
    minimize: false,
  },
};
