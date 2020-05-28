'use strict'

module.exports = (sequelize, DataTypes) => {
  const genres = sequelize.define('genres', {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    id_ogdb : DataTypes.INTEGER
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
  genres.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
  
    delete values.id_ogdb;
    return values;
  }
  return genres;
};