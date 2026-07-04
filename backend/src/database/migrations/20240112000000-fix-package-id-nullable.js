'use strict';

// Sequelize-CLI changeColumn does not reliably modify FK-constrained columns in MySQL.
// We must drop the FK, modify the column, then re-add the FK using raw SQL.

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TABLE memberships DROP FOREIGN KEY memberships_ibfk_2'
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE memberships MODIFY COLUMN package_id INT NULL'
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE memberships ADD CONSTRAINT memberships_ibfk_2
       FOREIGN KEY (package_id) REFERENCES packages(package_id)
       ON DELETE RESTRICT ON UPDATE CASCADE`
    );
  },

  async down(queryInterface) {
    // Set any NULL package_ids to a safe fallback before making NOT NULL again
    await queryInterface.sequelize.query(
      'UPDATE memberships SET package_id = (SELECT package_id FROM packages LIMIT 1) WHERE package_id IS NULL'
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE memberships DROP FOREIGN KEY memberships_ibfk_2'
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE memberships MODIFY COLUMN package_id INT NOT NULL'
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE memberships ADD CONSTRAINT memberships_ibfk_2
       FOREIGN KEY (package_id) REFERENCES packages(package_id)
       ON DELETE RESTRICT ON UPDATE CASCADE`
    );
  },
};
