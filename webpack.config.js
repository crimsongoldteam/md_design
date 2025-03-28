const path = require('path');

module.exports = {
  entry: './parser/app.js',
  output: {
    filename: 'Template.txt',
    path: path.resolve(__dirname, 'src/MDDesign/Templates/ParserJS/Ext/'),
  },
};

// const path = require('path');
// module.exports = {
//   mode: 'development',
//   entry: path.join(__dirname, 'src', 'index'),
//   watch: true,
//   output: {
//     path: path.join(__dirname, 'dist'),
//     publicPath: '/dist/',
//     filename: "bundle.js",
//     chunkFilename: '[name].js'
//   },
//   module: {
//     rules: [{
//       test: /.jsx?$/,
//       include: [
//         path.resolve(__dirname, 'src')
//       ],
//       exclude: [
//         path.resolve(__dirname, 'node_modules')
//       ],
//       loader: 'babel-loader',
//       options: {
//         presets: [
//           ["@babel/env", {
//             "targets": {
//               "browsers": "last 2 chrome versions"
//             }
//           }]
//         ]
//       }
//     }]
//   },
//   resolve: {
//     extensions: ['.json', '.js', '.jsx']
//   },
//   devtool: 'source-map',
//   devServer: {
//     contentBase: path.join(__dirname, '/dist/'),
//     inline: true,
//     host: 'localhost',
//     port: 8080,
//   }
// };