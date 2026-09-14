'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vouchers', {
      voucher_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      voucher_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      voucher_type: {
        type: Sequelize.ENUM('Member', 'Non Member'),
        allowNull: false,
        defaultValue: 'Non Member',
      },
      applicant: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      spouse: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      locations: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      benefit: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      issue_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      validity: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '1 Year',
      },
      expiry_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'REDEEMED', 'EXPIRED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      terms_and_conditions: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      redeemed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('vouchers', ['voucher_number'], {
      unique: true,
      name: 'idx_vouchers_voucher_number',
    });
    await queryInterface.addIndex('vouchers', ['status'], {
      name: 'idx_vouchers_status',
    });
    await queryInterface.addIndex('vouchers', ['email'], {
      name: 'idx_vouchers_email',
    });
    await queryInterface.addIndex('vouchers', ['phone'], {
      name: 'idx_vouchers_phone',
    });
    await queryInterface.addIndex('vouchers', ['expiry_date'], {
      name: 'idx_vouchers_expiry_date',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('vouchers');
  },
};
