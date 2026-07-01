'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'first_name', {
      type: Sequelize.STRING(50),
      allowNull: true,
      after: 'email',
    });

    await queryInterface.addColumn('users', 'middle_name', {
      type: Sequelize.STRING(50),
      allowNull: true,
      after: 'first_name',
    });

    await queryInterface.addColumn('users', 'last_name', {
      type: Sequelize.STRING(50),
      allowNull: true,
      after: 'middle_name',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'last_name');
    await queryInterface.removeColumn('users', 'middle_name');
    await queryInterface.removeColumn('users', 'first_name');
  },
};
