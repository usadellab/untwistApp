/** @type {import('next').NextConfig} */

const nextConfig = {

async rewrites() {
    return [
    {
        source: '/api',
        destination: '..............................',
    },
    {
        source: '/api/token',
        destination: '..............................',
    },
    {
        source: '/api/auth',
        destination: '..............................',
    },

    {
        source: '/api/getBucketList',
        destination: '..............................',
    },
    {
        source: '/api/getBucketObjectList',
        destination: '..............................',
    },
    {
        source: '/api/getBucketObjectData',
        destination: '..............................',
    },
    {
        source: '/api/getBucketObjectFile',
        destination: '..............................',
    },
    {
        source: '/api/annotateSNP',
        destination: '..............................',
    },
    {
        source: '/api/annotateSNPlist',
        destination: '..............................',
    }

    ]
}

};





module.exports = nextConfig;