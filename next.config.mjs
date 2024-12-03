/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
    responseLimit: "20mb",
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    // Agregar regla para manejar archivos de worker
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: "asset/resource",
      generator: {
        filename: "static/worker/[hash][ext][query]",
      },
    });
    return config;
  },
};

export default nextConfig;
