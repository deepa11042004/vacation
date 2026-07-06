'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'allowed_sections', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'status',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'allowed_sections');
  },
};
