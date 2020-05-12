'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_review = sequelize.define('users_review', {
    id_game: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER,
    review: DataTypes.STRING,
    review_score: DataTypes.INTEGER
  }, {
    updatedAt : 'updated_at',
    createdAt : 'created_at'
  });
  users_review.associate = function(models) {
    // associations can be defined here
  };
  return users_review;
};