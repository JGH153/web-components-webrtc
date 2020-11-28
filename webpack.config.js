const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack Boilerplate",
      template: path.resolve(__dirname, "./src/index.html"), // template file
      filename: "index.html", // output file
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "src/assets", to: "assets" },
        { from: "src/styles.css", to: "styles.css" },
        { from: "src/normalize.css", to: "normalize.css" },
      ],
    }),
  ],
  devServer: {
    contentBase: "./dist",
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
      // {
      //   test: /\.html$/i,
      //   loader: "html-loader",
      // },
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
  optimization: {
    minimize: false,
  },
};
