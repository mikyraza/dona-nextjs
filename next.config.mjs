/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const wpBase = (process.env.WORDPRESS_API_URL || 'http://localhost/wp-json').replace('/wp-json', '');
    return [
      {
        source: '/assets/core/uploads/:path*',
        destination: `${wpBase}/wp-content/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
