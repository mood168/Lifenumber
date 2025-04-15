/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',  // 如果部署在根目錄，保持為空
  assetPrefix: '',  // 如果部署在根目錄，保持為空
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.tonyai.work',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'test.tonyai.work',
        pathname: '/**',
      },
      
    ],
    unoptimized: true,  // 靜態導出時需要設置為 true
  },
  output: 'export',  // 使用靜態輸出
  distDir: 'dist',  // 指定輸出目錄
  trailingSlash: true,  // 在每個頁面路徑後添加斜線
};

export default nextConfig;
