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
    return queryInterface.bulkInsert('games', [
      {
        name: "The Witcher 3: Wild Hunt",
        description: "As war rages on throughout the Northern Realms, you take on the greatest contract of your life — tracking down the Child of Prophecy, a living weapon that can alter the shape of the world.",
        image: null,
        genre: "1,2,3",
        created_by: 1,
      }, {
        name: "The Long Dark",
        description: "The Long Dark is a thoughtful, exploration-survival experience that challenges solo players to think for themselves as they explore an expansive frozen wilderness in the aftermath of a geomagnetic disaster.",
        image: null,
        genre: "2,4,5",
        created_by: 2,
      },{
        name: "Terraria",
        description: "Dig, fight, explore, build! Nothing is impossible in this action-packed adventure game. Four Pack also available!",
        image: null,
        genre: "4,5,6",
        created_by: 3,
      },
    ], {});
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
