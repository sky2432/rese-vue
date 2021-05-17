module.exports = {
  transpileDependencies: ["vuetify"],
  pages: {
    index: {
      entry: "src/main.js",
      title: "Rese",
    },
  },
  configureWebpack: {
    devServer: {
      watchOptions: {
        poll: true,
      },
      disableHostCheck: true,
    },
  },
};
