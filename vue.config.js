module.exports = {
  transpileDependencies: ["vuetify"],
  pages: {
    index: {
      entry: "src/main.js",
      title: "Rese",
    },
  },
  devServer: {
    watchOptions: {
      poll: true,
    },
    host: "localhost",
  },
};
