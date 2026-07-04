'use strict';

/**
 * Three fixes in one:
 * 1. Reorder columns: group primary fields together, secondary fields together.
 *    primary_address, primary_state, primary_pincode,
 *    secondary_address, secondary_state, secondary_pincode
 *    (previously interleaved: primary_address, secondary_address, primary_state…)
 *
 * 2. Make client_id NOT NULL — migration 20240114 added it as nullable.
 *    Must drop+re-add the FK around the MODIFY because MySQL won't change
 *    nullability on a column that's part of an active FK constraint.
 *
 * 3. Add UNIQUE constraint on client_id — one address row per client.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const q = queryInterface.sequelize;

    // 1. Reorder: primary group together, then secondary group
    await q.query(`
      ALTER TABLE client_addresses
        MODIFY COLUMN primary_address TEXT NULL AFTER client_id,
        MODIFY COLUMN primary_state VARCHAR(100) NULL AFTER primary_address,
        MODIFY COLUMN primary_pincode VARCHAR(20) NULL AFTER primary_state,
        MODIFY COLUMN secondary_address TEXT NULL AFTER primary_pincode,
        MODIFY COLUMN secondary_state VARCHAR(100) NULL AFTER secondary_address,
        MODIFY COLUMN secondary_pincode VARCHAR(20) NULL AFTER secondary_state
    `);

    // 2a. Drop existing FK so we can change nullability
    await q.query(
      'ALTER TABLE client_addresses DROP FOREIGN KEY client_addresses_client_id_fk'
    ).catch(() => {});

    // 2b. Make client_id NOT NULL
    await q.query(
      'ALTER TABLE client_addresses MODIFY COLUMN client_id INT NOT NULL'
    );

    // 2c. Re-add FK with CASCADE (same as migration 20240114)
    await q.query(`
      ALTER TABLE client_addresses
        ADD CONSTRAINT client_addresses_client_id_fk
        FOREIGN KEY (client_id) REFERENCES clients(client_id)
        ON UPDATE CASCADE ON DELETE CASCADE
    `).catch(() => {});

    // 3. Add unique constraint — skip if already exists
    await q.query(
      'ALTER TABLE client_addresses ADD CONSTRAINT client_addresses_client_id_unique UNIQUE (client_id)'
    ).catch(() => {});
  },

  async down(queryInterface, Sequelize) {
    const q = queryInterface.sequelize;

    // Remove unique constraint
    await q.query(
      'ALTER TABLE client_addresses DROP INDEX client_addresses_client_id_unique'
    ).catch(() => {});

    // Drop FK, restore nullable, re-add FK
    await q.query(
      'ALTER TABLE client_addresses DROP FOREIGN KEY client_addresses_client_id_fk'
    ).catch(() => {});

    await q.query(
      'ALTER TABLE client_addresses MODIFY COLUMN client_id INT NULL'
    );

    await q.query(`
      ALTER TABLE client_addresses
        ADD CONSTRAINT client_addresses_client_id_fk
        FOREIGN KEY (client_id) REFERENCES clients(client_id)
        ON UPDATE CASCADE ON DELETE CASCADE
    `).catch(() => {});

    // Restore original column order (interleaved by field type)
    await q.query(`
      ALTER TABLE client_addresses
        MODIFY COLUMN primary_address TEXT NULL AFTER client_id,
        MODIFY COLUMN secondary_address TEXT NULL AFTER primary_address,
        MODIFY COLUMN primary_state VARCHAR(100) NULL AFTER secondary_address,
        MODIFY COLUMN secondary_state VARCHAR(100) NULL AFTER primary_state,
        MODIFY COLUMN primary_pincode VARCHAR(20) NULL AFTER secondary_state,
        MODIFY COLUMN secondary_pincode VARCHAR(20) NULL AFTER primary_pincode
    `);
  },
};
