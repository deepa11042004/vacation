'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('client_addresses');

    // Add client_id if it doesn't exist yet
    if (!tableDesc.client_id) {
      await queryInterface.addColumn('client_addresses', 'client_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'address_id',
      });
    }

    // Add FK constraint (ignore if already present)
    await queryInterface.sequelize.query(`
      ALTER TABLE client_addresses
        ADD CONSTRAINT client_addresses_client_id_fk
        FOREIGN KEY (client_id) REFERENCES clients(client_id)
        ON UPDATE CASCADE ON DELETE CASCADE
    `).catch(() => {});

    // Drop client_code if it still exists (drop FK first)
    if (tableDesc.client_code) {
      await queryInterface.sequelize.query(
        'ALTER TABLE client_addresses DROP FOREIGN KEY client_addresses_ibfk_1'
      ).catch(() => {});
      await queryInterface.sequelize.query(
        'ALTER TABLE client_addresses DROP COLUMN client_code'
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // Drop FK and client_id, restore client_code
    await queryInterface.sequelize.query(
      'ALTER TABLE client_addresses DROP FOREIGN KEY client_addresses_client_id_fk'
    ).catch(() => {});
    await queryInterface.sequelize.query(
      'ALTER TABLE client_addresses DROP COLUMN IF EXISTS client_id'
    ).catch(() => {});
    await queryInterface.addColumn('client_addresses', 'client_code', {
      type: Sequelize.STRING(20),
      allowNull: true,
      after: 'address_id',
    });
  },
};
