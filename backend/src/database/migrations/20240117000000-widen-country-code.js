'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('clients', 'country_code', {
      type: Sequelize.STRING(10),
      allowNull: false,
      defaultValue: '+91',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('clients', 'country_code', {
      type: Sequelize.STRING(5),
      allowNull: false,
    });
  },
};
