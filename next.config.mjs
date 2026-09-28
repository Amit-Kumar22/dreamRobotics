/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep Mongoose as a normal Node.js dependency (not bundled)
  serverExternalPackages: ['mongoose'],
};

export default nextConfig;
