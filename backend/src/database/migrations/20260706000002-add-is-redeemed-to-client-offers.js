'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('client_offers', 'is_redeemed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: 'valid_until',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('client_offers', 'is_redeemed');
  },
};
