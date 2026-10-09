import { fileURLToPath } from 'node:url';
export default {
  reactStrictMode: true,
  devIndicators: false,
  output: 'standalone',
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
  allowedDevOrigins: [
    'ais-dev-nc6q4nhqzz5kxicqhdlt6t-104005794168.asia-east1.run.app',
  ],
};

