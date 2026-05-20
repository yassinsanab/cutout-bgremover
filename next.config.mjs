/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use Terser (not SWC) for minification. Terser auto-detects .mjs files as
  // ES modules (module: true) so it can parse import/export from onnxruntime-web.
  swcMinify: false,

  webpack: (config, { isServer }) => {
    if (isServer) return config;

    // type:auto + url:false → bundle .mjs as JS; suppress new URL() asset emission
    // that would otherwise copy ort.node.min.mjs into static/media/ for the minifier.
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
      resolve: { fullySpecified: false },
      parser: { url: false },
    });

    return config;
  },

  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
      ],
    },
  ],
};

export default nextConfig;
