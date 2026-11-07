'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // When the booking confirmation was last emailed to the client (null = never sent).
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('bookings', 'email_sent_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('bookings', 'email_sent_at');
  },
};
