const {sequelize} = require('./db');
const {User, Post} = require('./');
const users = require('./seedData');
const posts = require('./postSeedData');
const bcrypt = require('bcrypt');

const seed = async () => {
  await sequelize.sync({ force: true }); // recreate db

  const userPromises = users.map(async (user) => {
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

  const postPromises = posts.map(async (post) => {
    try {
      const newPost = await Post.create({
        content: post.content
      });
      const user = await User.findOne({
        where: { username: post.content }
      });
      await user.addPost(newPost);
    } catch (error) {
      console.log(error);
    }
  })

  await Promise.all(userPromises);
  await Promise.all(postPromises);
}

module.exports = seed;
