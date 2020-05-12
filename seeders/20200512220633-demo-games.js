'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('games', [{
      name: 'Dota 2'
    },{
      name: 'CSGO'
    },{
      name: 'Lost Saga'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('games', null, {});
  }
};
