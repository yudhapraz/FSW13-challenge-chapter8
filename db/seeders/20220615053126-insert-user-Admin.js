const bcrypt = require('bcryptjs');
const { Role } = require('../../app/models');

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = 'customer';
    const encryptedPassword = bcrypt.hashSync(password);
    const timestamp = new Date();

    const role = await Role.findOne({
      where: {
        name: 'CUSTOMER',
      },
    });

    const user = [
      {
        name: 'inicustomer',
        email: 'inicustomer@binar.co.id',
        encryptedPassword,
        roleId: role.id,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ];

    await queryInterface.bulkInsert('Users', user, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
