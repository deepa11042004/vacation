'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      booking_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'clients', key: 'client_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      membership_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'memberships', key: 'membership_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      assist_by: { type: Sequelize.STRING(100), allowNull: true, defaultValue: null },
      contact_number: { type: Sequelize.STRING(20), allowNull: true, defaultValue: null },
      check_in: { type: Sequelize.DATEONLY, allowNull: false },
      check_out: { type: Sequelize.DATEONLY, allowNull: false },
      nights: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      no_of_rooms: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      no_of_adults: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      children: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      booking_type: { type: Sequelize.STRING(200), allowNull: true, defaultValue: null },
      hotel_name: { type: Sequelize.STRING(200), allowNull: false },
      hotel_address: { type: Sequelize.TEXT, allowNull: true, defaultValue: null },
      hotel_contact: { type: Sequelize.STRING(30), allowNull: true, defaultValue: null },
      confirmation_number: { type: Sequelize.STRING(100), allowNull: true, defaultValue: null },
      booking_amount: { type: Sequelize.DECIMAL(12, 2), allowNull: true, defaultValue: null },
      room_category: { type: Sequelize.STRING(100), allowNull: true, defaultValue: null },
      remark: { type: Sequelize.TEXT, allowNull: true, defaultValue: null },
      night_type: {
        type: Sequelize.ENUM('MEMBERSHIP', 'COMPLIMENTARY', 'EXTRA'),
        allowNull: false,
        defaultValue: 'MEMBERSHIP',
      },
      redeemed_offer_ids: { type: Sequelize.JSON, allowNull: true, defaultValue: null },
      amount_paid_by_client: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      note: { type: Sequelize.TEXT, allowNull: true, defaultValue: null },
      status: {
        type: Sequelize.ENUM('CONFIRMED', 'COMPLETED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'CONFIRMED',
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
      deleted_at: { type: Sequelize.DATE, allowNull: true, defaultValue: null },
    });

    await queryInterface.addIndex('bookings', ['client_id'], { name: 'idx_bookings_client_id' });
    await queryInterface.addIndex('bookings', ['membership_id'], { name: 'idx_bookings_membership_id' });
    await queryInterface.addIndex('bookings', ['check_in'], { name: 'idx_bookings_check_in' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('bookings');
  },
};
