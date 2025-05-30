// const sequelize = require('./db');
// const Role = require('../models/Role');
// const User = require('../models/User');

// const seed = async () => {
//   try {
//     await sequelize.sync({ force: true }); 
    
//     await Role.bulkCreate([{ name: 'user' }, { name: 'superadmin' }]);

    
//     await User.create({
//       username: 'admin',
//       email: 'admin@example.com',
//       password: 'admin123',
//       role: 'superadmin',
//     });
//     console.log('Seeding successful!');
//   } catch (error) {
//     console.error('Seeding failed:', error);
//   } finally {
//     await sequelize.close();
//   }
// };

// seed();
