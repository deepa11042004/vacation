'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Admin-editable booking number. Existing bookings keep the number they were showing (BK-000007 style).
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('bookings', 'booking_number', {
      type: Sequelize.STRING(40),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.sequelize.query(
      "UPDATE bookings SET booking_number = CONCAT('BK-', LPAD(booking_id, 6, '0')) WHERE booking_number IS NULL",
    );
    await queryInterface.addIndex('bookings', ['booking_number'], { name: 'bookings_booking_number_unique', unique: true });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('bookings', 'bookings_booking_number_unique');
    await queryInterface.removeColumn('bookings', 'booking_number');
  },
};
