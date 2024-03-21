/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    trailingSlash: true,
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${process.env.STRAPI_API_URL}/:path*`
            },
        ];
    },
}

module.exports = nextConfig
