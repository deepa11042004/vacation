'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('locations');

    if (!tableDesc.famous_sightseens) {
      await queryInterface.addColumn('locations', 'famous_sightseens', {
        type: Sequelize.JSON,
        allowNull: true,
        after: 'description',
      });
    }

    if (!tableDesc.is_online) {
      await queryInterface.addColumn('locations', 'is_online', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        after: 'famous_sightseens',
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('locations', 'famous_sightseens');
    await queryInterface.removeColumn('locations', 'is_online');
  },
};
