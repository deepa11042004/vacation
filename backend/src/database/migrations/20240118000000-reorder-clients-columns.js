'use strict';

/**
 * Moves the six columns that were appended at the end (via earlier ALTER TABLE statements)
 * to their logical position right after `status`.
 *
 * Final order after this migration:
 *   client_id, first_name, middle_name, last_name, gender, date_of_birth,
 *   mobile, alternate_mobile, email, country_code, profile_photo, status,
 *   sales_consultant, take_over_manager, dsa, reference_by,
 *   marriage_anniversary, spouse_name,
 *   remarks, created_by, updated_by, created_at, updated_at, deleted_at
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const q = queryInterface.sequelize;

    // Move each column into its correct position using MODIFY COLUMN ... AFTER ...
    // Order matters: each move depends on the previous one having completed.
    await q.query(`
      ALTER TABLE clients
        MODIFY COLUMN sales_consultant VARCHAR(100) NULL AFTER status,
        MODIFY COLUMN take_over_manager VARCHAR(100) NULL AFTER sales_consultant,
        MODIFY COLUMN dsa ENUM('VENUE','CSDO','OTHER') NULL DEFAULT NULL AFTER take_over_manager,
        MODIFY COLUMN reference_by VARCHAR(100) NULL AFTER dsa,
        MODIFY COLUMN marriage_anniversary DATE NULL AFTER reference_by,
        MODIFY COLUMN spouse_name VARCHAR(100) NULL AFTER marriage_anniversary
    `);
  },

  async down(queryInterface, Sequelize) {
    // Move them back to the end
    const q = queryInterface.sequelize;
    await q.query(`
      ALTER TABLE clients
        MODIFY COLUMN sales_consultant VARCHAR(100) NULL AFTER deleted_at,
        MODIFY COLUMN take_over_manager VARCHAR(100) NULL AFTER sales_consultant,
        MODIFY COLUMN dsa ENUM('VENUE','CSDO','OTHER') NULL DEFAULT NULL AFTER take_over_manager,
        MODIFY COLUMN reference_by VARCHAR(100) NULL AFTER dsa,
        MODIFY COLUMN marriage_anniversary DATE NULL AFTER reference_by,
        MODIFY COLUMN spouse_name VARCHAR(100) NULL AFTER marriage_anniversary
    `);
  },
};
