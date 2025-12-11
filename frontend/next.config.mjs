/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable WebAuthn/Passkey support
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },

  experimental: {
    esmExternals: true,
    serverComponentsExternalPackages: ['sodium-native', 'qrcode'],
  },

  webpack: (config, { dev, isServer }) => {
    // Resolve fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    };

    // Handle native modules
    if (isServer) {
      config.externals.push({
        'sodium-native': 'commonjs sodium-native',
      });
    }

    // Ignore warnings from native modules
    config.ignoreWarnings = [
      { module: /node_modules\/sodium-native/ },
      { module: /node_modules\/require-addon/ },
      /Critical dependency/,
    ];

    return config;
  },
};

export default nextConfig;
