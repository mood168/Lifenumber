/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',  // 如果部署在根目錄，保持為空
  assetPrefix: '',  // 如果部署在根目錄，保持為空
  images: {
    unoptimized: true,  // 關閉圖片優化，允許任何域名
    domains: ['images.unsplash.com', 'images.tonyai.work', 'test.tonyai.work'], // 添加 unsplash 域名
  },
  output: 'export',  // 使用靜態輸出
  distDir: 'dist',  // 指定輸出目錄
  trailingSlash: true,  // 在每個頁面路徑後添加斜線
};

export default nextConfig;
