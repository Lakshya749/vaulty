/** @type {import('next').NextConfig} */
const isGithubPages = process.env.DEPLOY_TARGET === 'gh-pages';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: isGithubPages ? '/vaulty' : '',
};
export default nextConfig;
