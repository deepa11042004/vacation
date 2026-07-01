'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('clients', 'marriage_anniversary', {
      type: Sequelize.DATEONLY,
      allowNull: true,
      after: 'reference_by',
    });

    await queryInterface.addColumn('clients', 'spouse_name', {
      type: Sequelize.STRING(100),
      allowNull: true,
      after: 'marriage_anniversary',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('clients', 'spouse_name');
    await queryInterface.removeColumn('clients', 'marriage_anniversary');
  },
};
