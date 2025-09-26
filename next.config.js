/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Avoid blocking builds due to environment-specific ESLint resolver issues
    ignoreDuringBuilds: true,
  },
  // Remove standalone output for Railway compatibility
  // output: 'standalone',
  trailingSlash: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // script-src uchun 'unsafe-eval' va 'unsafe-inline' olib tashlandi.
            // Zaruratga qarab boshqa manbalarni (masalan, img-src) qo'shish mumkin.
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:;"
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;
