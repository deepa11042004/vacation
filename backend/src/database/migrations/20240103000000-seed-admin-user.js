'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the admin user already exists
    const [existing] = await queryInterface.sequelize.query(
      `SELECT user_id FROM users WHERE email = 'admin@crm.com' LIMIT 1;`
    );

    if (existing.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('AdminPassword123', salt);

      await queryInterface.bulkInsert('users', [{
        email: 'admin@crm.com',
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date()
      }]);
      console.log('Seeded super admin user (admin@crm.com / AdminPassword123)');
    } else {
      console.log('Super admin user already exists.');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@crm.com' });
  }
};
