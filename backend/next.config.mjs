/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['sequelize', 'mysql2', 'pdfkit', 'nodemailer'],
};

export default nextConfig;
