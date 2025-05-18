import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL('https://d3kixxf71ic3lt.cloudfront.net/**')],
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);