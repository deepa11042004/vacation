'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('clients');
    if (!tableDesc.birthday_mail_sent_year) {
      await queryInterface.addColumn('clients', 'birthday_mail_sent_year', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        after: 'is_welcome_mail_sent',
      });
    }
    if (!tableDesc.anniversary_mail_sent_year) {
      await queryInterface.addColumn('clients', 'anniversary_mail_sent_year', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        after: 'birthday_mail_sent_year',
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('clients', 'birthday_mail_sent_year');
    await queryInterface.removeColumn('clients', 'anniversary_mail_sent_year');
  },
};
