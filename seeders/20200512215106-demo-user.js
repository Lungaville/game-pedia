'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkInsert('users', [{
        name: 'William Mulianto',
        email: 'william.mulianto@gmail.com',
        phone_number: '081250818659',
        gender: 0,
      },{
        name: 'Sandy Khosasi',
        email: 'sandy.kho@gmail.com',
        phone_number: '0812557778',
        gender: 0,
      },{
        name: 'Richard Ivan',
        email: 'william.mulianto@gmail.com',
        phone_number: '081250818431',
        gender: 0,
      },{
        name: 'Robby Suryanata',
        email: 'robby@gmail.com',
        phone_number: '08125023112',
        gender: 0,
      }], {});
    
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
   return queryInterface.bulkDelete('users', null, {});
  }
};
