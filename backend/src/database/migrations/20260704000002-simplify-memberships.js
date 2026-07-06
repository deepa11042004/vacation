'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop FK constraint on package_id (MySQL requires dropping FK before the column)
    try {
      const [rows] = await queryInterface.sequelize.query(`
        SELECT CONSTRAINT_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_NAME = 'memberships'
          AND COLUMN_NAME = 'package_id'
          AND REFERENCED_TABLE_NAME IS NOT NULL
          AND TABLE_SCHEMA = DATABASE()
      `);
      if (rows.length > 0) {
        await queryInterface.sequelize.query(
          `ALTER TABLE memberships DROP FOREIGN KEY \`${rows[0].CONSTRAINT_NAME}\``
        );
      }
    } catch (_) { /* dialect may not need this */ }

    // Drop package_id index
    try {
      await queryInterface.removeIndex('memberships', 'memberships_package_id_idx');
    } catch (_) {}

    // Drop columns
    await queryInterface.removeColumn('memberships', 'package_id');
    await queryInterface.removeColumn('memberships', 'start_date');

    // Add amc (Annual Maintenance Charge)
    await queryInterface.addColumn('memberships', 'amc', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('memberships', 'amc');

    await queryInterface.addColumn('memberships', 'start_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('memberships', 'package_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
