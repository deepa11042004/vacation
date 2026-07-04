'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Drop title column from clients
    await queryInterface.removeColumn('clients', 'title');

    // 2. Make package_id nullable (FK constraint stays, NULL = free-text package)
    await queryInterface.changeColumn('memberships', 'package_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'packages', key: 'package_id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    // 3. Add package_name for free-text package entry
    await queryInterface.addColumn('memberships', 'package_name', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'package_id',
    });

    // 4. Add validity_years (stored when using free-text package)
    await queryInterface.addColumn('memberships', 'validity_years', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'package_name',
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverse order
    await queryInterface.removeColumn('memberships', 'validity_years');
    await queryInterface.removeColumn('memberships', 'package_name');

    await queryInterface.changeColumn('memberships', 'package_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'packages', key: 'package_id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addColumn('clients', 'title', {
      type: Sequelize.STRING(10),
      allowNull: true,
      after: 'client_id',
    });
  },
};
