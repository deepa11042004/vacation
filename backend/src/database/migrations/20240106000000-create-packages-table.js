'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('packages', {
      package_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      category: {
        type: Sequelize.ENUM('SILVER', 'GOLD', 'PLATINUM'),
        allowNull: false,
      },
      validity_years: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_nights: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      nights_per_year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unit_type: {
        type: Sequelize.ENUM('STUDIO', '1BHK', '2BHK', 'SUITE'),
        allowNull: false,
      },
      max_adults: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
      },
      max_children: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      base_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      amc_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Unique constraint: no two packages with same name under same category
    await queryInterface.addIndex('packages', ['name', 'category'], {
      unique: true,
      name: 'packages_name_category_unique',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('packages');
  },
};
