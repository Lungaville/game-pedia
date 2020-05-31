'use strict';
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('transaction', {
    id_user: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    expired_at: DataTypes.DATE,
    transaction_id: DataTypes.STRING,
  }, {});
  transaction.associate = function(models) {
    // associations can be defined here
  };
  return transaction;
};