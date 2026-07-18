'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Only runs if the table already exists from a previous migration
    try {
      await queryInterface.sequelize.query(
        `ALTER TABLE travel_queries MODIFY COLUMN query_type ENUM('FLIGHT','HOTEL','CAR_RENTAL','TRANSPORT','VISA','STAYS') NOT NULL`
      );
    } catch {
      // Table doesn't exist yet — will be created with STAYS by the create migration
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.sequelize.query(
        `ALTER TABLE travel_queries MODIFY COLUMN query_type ENUM('FLIGHT','HOTEL','CAR_RENTAL','TRANSPORT','VISA') NOT NULL`
      );
    } catch { /* ignore */ }
  },
};
