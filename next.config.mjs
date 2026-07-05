/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // クリックジャッキング防止
          { key: "X-Frame-Options", value: "DENY" },
          // MIMEスニッフィング防止
          { key: "X-Content-Type-Options", value: "nosniff" },
          // リファラの過剰送信を抑制
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // 不要なブラウザ機能を無効化
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
