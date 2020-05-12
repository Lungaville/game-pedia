'use strict';
module.exports = (sequelize, DataTypes) => {
  const users_game = sequelize.define('users_games', {
    id_game: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER
  }, {
    updatedAt : 'updated_at',
    createdAt : 'created_at'
  });
  users_game.associate = function(models) {
    // associations can be defined here
  };
  return users_game;
};