const sequelize = require('./db');
const Role = require('../models/Role');
const User = require('../models/User');

const seed = async () => {
  try {
    await sequelize.sync({ force: true }); // Drop table lama dan buat baru

    // Seed Role
    await Role.bulkCreate([{ name: 'user' }, { name: 'superadmin' }]);

    // Seed User (password akan dienkripsi nanti)
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'superadmin',
    });
    console.log('Seeding successful!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await sequelize.close();
  }
};

seed();
