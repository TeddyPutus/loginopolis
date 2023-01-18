const {sequelize} = require('./db');
const {User} = require('./');
const users = require('./seedData');
const bcrypt = require('bcrypt');

const seed = async () => {
  await sequelize.sync({ force: true }); // recreate db

  users.map(async (user) => {
    try {
      //hash the password for storage in the database, then create the user
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await User.create({
          username : user.username,
          password: hashedPassword
      })
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = seed;
