'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staff', {
      staff_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      employee_id: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      designation: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      department: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      joining_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('staff');
  },
};
