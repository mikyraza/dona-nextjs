/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (!process.env.WORDPRESS_API_URL) {
      return [];
    }
    const wpBase = process.env.WORDPRESS_API_URL.replace('/wp-json', '');
    return [
      {
        source: '/assets/core/uploads/:path*',
        destination: `${wpBase}/wp-content/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
