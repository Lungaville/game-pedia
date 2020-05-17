'use strict';
module.exports = (sequelize, DataTypes) => {
  const genre_games = sequelize.define('genre_games', {
    id_game: DataTypes.INTEGER,
    id_genre: DataTypes.INTEGER
  }, {});
  genre_games.associate = function(models) {
    // associations can be defined here
  };
  
  genre_games.prototype.toJSON =  function () {
    return Object.assign({}, this.get());
  }
  return genre_games;
};