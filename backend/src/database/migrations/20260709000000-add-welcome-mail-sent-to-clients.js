'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('clients');
    if (!tableDesc.is_welcome_mail_sent) {
      await queryInterface.addColumn('clients', 'is_welcome_mail_sent', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        after: 'status',
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('clients', 'is_welcome_mail_sent');
  },
};
