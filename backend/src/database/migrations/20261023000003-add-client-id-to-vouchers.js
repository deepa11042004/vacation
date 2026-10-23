'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Null = voucher issued to an outsider (non-client). No FK so deleting a client never blocks on vouchers.
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('vouchers', 'client_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addIndex('vouchers', ['client_id'], { name: 'idx_vouchers_client_id' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('vouchers', 'idx_vouchers_client_id');
    await queryInterface.removeColumn('vouchers', 'client_id');
  },
};
