const {Sequelize, sequelize} = require('./db');

//Creating a User child class from the Model parent class
const Post = sequelize.define('post', {
    content: Sequelize.STRING
  });

//exports
module.exports = { Post }