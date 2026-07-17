'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('clients');
    if (!tableDesc.qr_token) {
      await queryInterface.addColumn('clients', 'qr_token', {
        type: Sequelize.STRING(64),
        allowNull: true,
        defaultValue: null,
        unique: true,
        after: 'spouse_name',
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('clients', 'qr_token');
  },
};
