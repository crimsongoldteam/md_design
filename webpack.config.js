const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./parser/app.js",
  mode: "production",
  output: {
    filename: 'template.js',
    path: path.resolve(__dirname, 'temp'),
    clean: true
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './temp/template.js',
          to: path.resolve(__dirname, 'src/MDDesign/Templates/ParserJS/Ext/Template.txt'),
          transform(content) {
            const jsContent = content.toString('utf8');
            // Добавляем BOM
            const contentWithBom = `\uFEFF${jsContent}`;
            return contentWithBom;          
          },
        },
      ],
    }),
  ],  
};