'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('memberships', 'reference_by', {
      type: Sequelize.STRING(150),
      allowNull: true,
    });

    await queryInterface.addColumn('memberships', 'referrer_membership_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'memberships',
        key: 'membership_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      after: 'reference_by',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('memberships', 'referrer_membership_id');

    await queryInterface.changeColumn('memberships', 'reference_by', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },
};
