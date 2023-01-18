const {sequelize, Sequelize} = require('./db');
const { Post } = require('./Post')
const { User } = require('./User')

Post.belongsTo(User)
User.hasMany(Post)

module.exports = {
    User,
    Post,
    sequelize,
    Sequelize
};
