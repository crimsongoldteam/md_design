const path = require("path");

const webpack = require("webpack");

// const BomPlugin = require("webpack-utf8-bom");
// const FileManagerPlugin = require("filemanager-webpack-plugin");
const RenameWebpackPlugin = require("rename-webpack-plugin");

module.exports = {
  entry: "./parser/app.js",
  mode: "production",
  output: {
    filename: "template.js",
    path: path.resolve(__dirname, "src/MDDesign/Templates/ParserJS/Ext"),
    clean: true,
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: "\uFEFF",
      raw: true,
      stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT

    }),
    new RenameWebpackPlugin({
      originNameReg: "template.js",
      targetName: "Template.txt"
    }),

    //   new FileManagerPlugin({
    //     runTasksInSeries: true,
    //     events: {
    //       onStart: {
    //         delete: [
    //           {
    //             source:  path.resolve(
    //               __dirname,
    //               "src/MDDesign/Templates/ParserJS/Ext/Template.txt"
    //             ),
    //             options: {
    //               force: true,
    //             },
    //           },
    //         ],
    //         move: [
    //           {
    //             source: "./temp/template.js",
    //             destination: path.resolve(
    //               __dirname,
    //               "src/MDDesign/Templates/ParserJS/Ext/Template.txt"
    //             ),
    //           },
    //         ],
    //       },
    //     },
    //   }),
  ],
};
