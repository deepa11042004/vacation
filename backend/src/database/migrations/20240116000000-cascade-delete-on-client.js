'use strict';

/**
 * Change ON DELETE RESTRICT → CASCADE so deleting a client automatically
 * removes their memberships and payments (and deleting a membership removes its payments).
 */
module.exports = {
  async up(queryInterface) {
    const q = queryInterface.sequelize;

    // memberships.client_id → clients.client_id
    await q.query('ALTER TABLE memberships DROP FOREIGN KEY memberships_ibfk_1').catch(() => {});
    await q.query(`
      ALTER TABLE memberships
        ADD CONSTRAINT memberships_ibfk_1
        FOREIGN KEY (client_id) REFERENCES clients(client_id)
        ON UPDATE CASCADE ON DELETE CASCADE
    `);

    // payments.client_id → clients.client_id  (ibfk_2 by default creation order)
    await q.query('ALTER TABLE payments DROP FOREIGN KEY payments_ibfk_2').catch(() => {});
    await q.query(`
      ALTER TABLE payments
        ADD CONSTRAINT payments_ibfk_2
        FOREIGN KEY (client_id) REFERENCES clients(client_id)
        ON UPDATE CASCADE ON DELETE CASCADE
    `);

    // payments.membership_id → memberships.membership_id  (ibfk_1 by default)
    await q.query('ALTER TABLE payments DROP FOREIGN KEY payments_ibfk_1').catch(() => {});
    await q.query(`
      ALTER TABLE payments
        ADD CONSTRAINT payments_ibfk_1
        FOREIGN KEY (membership_id) REFERENCES memberships(membership_id)
        ON UPDATE CASCADE ON DELETE CASCADE
    `);
  },

  async down(queryInterface) {
    const q = queryInterface.sequelize;

    await q.query('ALTER TABLE memberships DROP FOREIGN KEY memberships_ibfk_1').catch(() => {});
    await q.query(`
      ALTER TABLE memberships
        ADD CONSTRAINT memberships_ibfk_1
        FOREIGN KEY (client_id) REFERENCES clients(client_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
    `);

    await q.query('ALTER TABLE payments DROP FOREIGN KEY payments_ibfk_2').catch(() => {});
    await q.query(`
      ALTER TABLE payments
        ADD CONSTRAINT payments_ibfk_2
        FOREIGN KEY (client_id) REFERENCES clients(client_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
    `);

    await q.query('ALTER TABLE payments DROP FOREIGN KEY payments_ibfk_1').catch(() => {});
    await q.query(`
      ALTER TABLE payments
        ADD CONSTRAINT payments_ibfk_1
        FOREIGN KEY (membership_id) REFERENCES memberships(membership_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
    `);
  },
};
