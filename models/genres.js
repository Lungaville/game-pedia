'use strict'

module.exports = (sequelize, DataTypes) => {
  const genres = sequelize.define('genres', {
    name: DataTypes.STRING,
  }, {
    updatedAt : 'updated_at',
    createdAt : 'created_at',
  },);
  genres.associate = function(models) {
    // associations can be defined here
  };
  genres.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    return values;
  }
  return genres;
};