/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.module.rules.push({
      test: /\.yml$/i,
      type: 'asset/source',
    })

    if (isServer) return config
    // Important: return the modified config
    config.resolve.fallback = {
      ...config.resolve.fallback,
      assert: require.resolve('assert/'),
      buffer: require.resolve('buffer'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      url: require.resolve('url/'),
      util: require.resolve('util/'),
      debug: false,
      canvas: false,
      fs: false,
    }

    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      })
    );

    return config
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Netlify-CDN-Cache-Control',
            value: 'public, s-maxage=31536000, must-revalidate',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
