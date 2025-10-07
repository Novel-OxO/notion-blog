import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // 외부 이미지 출처가 다양한 경우 최적화 비활성화
  },
};

export default nextConfig;
