'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('itineraries', {
      itinerary_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      destination: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('DOMESTIC', 'INTERNATIONAL'),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      badge: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      duration: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      days: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      nights: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      best_time: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      short_desc: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      highlights: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      inclusions: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      schedule: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE',
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('itineraries', ['slug'], {
      unique: true,
      name: 'unique_itinerary_slug',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('itineraries');
  },
};
