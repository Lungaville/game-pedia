'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('users', [
      //   {
      //   name: 'William Mulianto',
      //   email: 'william.mulianto@gmail.com',
      //   password :'willy123',
      //   phone_number: '081250818659',
      //   gender: 0,
      // },
      {
        id_game: 1,
        id_user: 1,
        review: 'One of best game!',
        review_score: 9,
      }, {
        id_game: 1,
        id_user: 2,
        review: 'Good to pass time!',
        review_score: 7,
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('users_reviews', null, {});
  }
};
