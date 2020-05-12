

const model = require('../models/index');
var userExist = (value,{req}) =>{
    return model.users.findOne({ where : {id : value}}).then((user) => {
      if(user == null){
        return Promise.reject('User Not Found');
      }
  
    })
}

var gameExist = (value,{req}) =>{
    return model.games.findOne({ where : {id : value}}).then((games) => {
      if(games == null){
        return Promise.reject('Games Not Found');
      }
  
    })
}
var userGameUnique = (value,{req}) =>{
    return model.users_games.findOne({ where : {id_user : req.params.id_user || req.body.id_user , id_game : req.params.id_game || req.body.id_game }}).then((review) => {
      if(review != null){
        return Promise.reject('Review Duplicate');
      }
  
    })
}


module.exports = Object.freeze({
    userExists: userExist,
    gameExists : gameExist,
    userGameUnique: userGameUnique
});