'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users_games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_game: {
        type: Sequelize.INTEGER
      },
      id_user: {
        type: Sequelize.INTEGER
      },
      //1 playing 2 completed-story 3 playing dlc
      tipe :{
        type: Sequelize.INTEGER
      },
      complete_time :{
        type: Sequelize.TIME
      },
      photo : {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    }, );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users_games');
  }
};