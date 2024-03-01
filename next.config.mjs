/** @type {import('next').NextConfig} */
const nextConfig = {
    generateBuildId: async () => {
        // This could be anything, using the latest git hash
        return 'blah'
    },
    output: 'export'
};

export default nextConfig;
