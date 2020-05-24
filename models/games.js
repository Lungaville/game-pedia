'use strict';
module.exports = (sequelize, DataTypes) => {
  const games = sequelize.define('games', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    genre: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
  }, {
    updatedAt : 'updated_at',
    createdAt : 'created_at'
  });
  games.associate = function(models) {
    // associations can be defined here
    games.belongsTo(models.users, {
      foreignKey: "created_by",
      as: "developer",
    });
  };
  return games;
};