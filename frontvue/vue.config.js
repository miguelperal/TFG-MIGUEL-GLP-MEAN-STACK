const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Cambia esto por la URL de tu servidor backend
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
    historyApiFallback: true,
  },
});
