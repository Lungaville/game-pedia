'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_reviews = sequelize.define('users_reviews', {
    id_game: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER,
    review: DataTypes.STRING,
    review_score: DataTypes.INTEGER
  }, {
    updatedAt : 'updated_at',
    createdAt : 'created_at'
  });
  users_reviews.associate = function(models) {
    // associations can be defined here
  };
  return users_reviews;
};