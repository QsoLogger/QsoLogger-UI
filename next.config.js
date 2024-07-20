const withLess = require('next-with-less');

module.exports = withLess({
  lessLoaderOptions: {
    lessOptions: {
      javascriptEnabled: true,
    },
  },
  output: 'export',
  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  trailingSlash: true,
  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  skipTrailingSlashRedirect: false,
  // 根据不同build环境，发布到不同的目录中
  distDir: `build/${process.env.NODE_ENV}`,
  images: { loader: 'custom', loaderFile: './src/utils/image-loader.ts' },
  generateBuildId: async () =>
    // This could be anything, using the latest git hash
    process.env?.VERSION ?? process.env.NODE_ENV ?? 'dev',
  compiler: {
    removeConsole: {
      exclude:
        process.env.NODE_ENV === 'development'
          ? ['log', 'error', 'table', 'dir', 'warn', 'group', 'groupEnd']
          : ['error'],
    },
  },
});
