'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    name: DataTypes.STRING,
    password : DataTypes.STRING,
    token : DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    tipe : DataTypes.INTEGER,
  }, {
    updatedAt : 'updated_at',
    createdAt : 'created_at',
    hooks : {
      beforeCreate: async function(user) {
        const salt = await bcrypt.genSalt(10); //whatever number you want
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },);
  users.associate = function(models) {
    // associations can be defined here
  };
  users.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
  
    delete values.password;
    delete values.token;
    return values;
  }
  users.prototype.validPassword = function(pass) {
    return bcrypt.compareSync(pass, this.password);
  };
  return users;
};