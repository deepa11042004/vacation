/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['sequelize', 'mysql2', 'pdfkit', 'nodemailer', 'node-cron'],
};

export default nextConfig;
