import { fileURLToPath } from 'node:url';
export default { reactStrictMode: true, devIndicators: false, turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) } };
