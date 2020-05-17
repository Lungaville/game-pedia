'use strict';
module.exports = (sequelize, DataTypes) => {
  const games = sequelize.define('games', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    developer: DataTypes.STRING,
    image: DataTypes.STRING,
    genre: DataTypes.STRING
  }, {
    updatedAt : 'updated_at',
    createdAt : 'created_at'
  });
  games.associate = function(models) {
    // associations can be defined here
  };
  return games;
};