'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        name: "richard",
        email: "richard@gmail.com",
        password: "ric123",
        gender: "1",
        phone_number: "08513838475",
        tipe: 1,
      },
    ], {});
   return queryInterface.bulkDelete('users', null, {});
      // return queryInterface.bulkInsert('users', [
      // //   {
      // //   name: 'William Mulianto',
      // //   email: 'william.mulianto@gmail.com',
      // //   password :'willy123',
      // //   phone_number: '081250818659',
      // //   gender: 0,
      // // },
      // {
      //   name: 'Sandy Khosasi',
      //   email: 'sandy.kho@gmail.com',
      //   password :'sandy123',
      //   phone_number: '0812557778',
      //   gender: 0,
      // },{
      //   name: 'Richard Ivan',
      //   password :'richard123',
      //   email: 'richard@gmail.com',
      //   phone_number: '081250818431',
      //   gender: 0,
      // },{
      //   name: 'Robby Suryanata',
      //   password :'robby123',
      //   email: 'robby@gmail.com',
      //   phone_number: '08125023112',
      //   gender: 0,
      // }], {});
      
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
