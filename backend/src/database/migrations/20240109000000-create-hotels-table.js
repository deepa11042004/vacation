'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hotels', {
      hotel_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      hotel_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      location_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'locations',
          key: 'location_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      hotel_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      property_type: {
        type: Sequelize.ENUM('INTERNAL_PROPERTY', 'ASSOCIATED_PROPERTY'),
        allowNull: false,
      },
      hotel_type: {
        type: Sequelize.ENUM('HOTEL', 'RESORT', 'VILLA', 'APARTMENT', 'HOMESTAY', 'GUEST_HOUSE'),
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      map_link: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        defaultValue: 'ACTIVE',
        allowNull: false,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    // Unique combination of hotel name in same location
    await queryInterface.addIndex('hotels', ['location_id', 'hotel_name'], {
      unique: true,
      name: 'unique_hotel_name_per_location',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('hotels');
  },
};
