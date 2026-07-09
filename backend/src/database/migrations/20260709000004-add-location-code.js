'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('locations');
    if (!tableDesc.location_code) {
      await queryInterface.addColumn('locations', 'location_code', {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
        after: 'location_id',
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('locations', 'location_code');
  },
};
