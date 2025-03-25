const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/frontend/src/index.js", // Entry point for React
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bundle.js", // Output file name
    clean: true, // Clean the output directory before each build
  },
  mode: "development", // Set to "production" for production builds
  devtool: "source-map", // Generate source maps for debugging
  devServer: {
    static: path.resolve(__dirname, "dist"), // Serve files from the output directory
    port: 3000, // Development server port
    open: true, // Automatically open the browser
    hot: true, // Enable hot module replacement
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Transpile JavaScript files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/, // Process CSS files
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/, // Process HTML files
        use: ["html-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/, // Process image files
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/frontend/public/index.html", // Template HTML file
      filename: "index.html", // Output HTML file
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"], // Resolve these extensions
  },
};