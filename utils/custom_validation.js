const model = require('../models/index');

var gameExist = (value,{req}) =>{
    return model.games.findOne({ where : {id : value}}).then((games) => {
      if(games == null){
        return Promise.reject('Games Not Found');
      }
  
    })
}

var userExist = (value,{req}) =>{
    return model.users.findOne({ where : {id : value}}).then((user) => {
      console.log(user);
      if(user == null){
        return Promise.reject('User Not Found');
      }
    })
}

var reviewExist = (value,{req}) =>{
    return model.users_reviews.findOne({ where : {id : value}}).then((games) => {
      if(games == null){
        return Promise.reject('Review Not Found');
      }
  
    })
}

var userGameUnique = (value,{req}) =>{
    return model.users_games.findOne({ where : {id_user : req.params.id_user || req.body.id_user || req.user_auth.id , id_game : req.params.id_game || req.body.id_game }}).then((review) => {
      if(review != null){
        return Promise.reject('User game duplicate');
      }
  
    })
}


module.exports = Object.freeze({
    userExists: userExist,
    gameExists : gameExist,
    userGameUnique: userGameUnique,
    reviewExist: reviewExist,
});