var express = require("express");
var router = express.Router();
var httpCode = require("../utils/http-code");
var customValidation = require("../utils/custom_validation");
var httpCode = require("../utils/http-code");
const model = require("../models/index");
var customMiddleware = require("../utils/custom_middleware");
var response = require("../utils/response_function");

const { check, validationResult } = require("express-validator");

function checkGameExists(id_game) {
  return model.games.findOne({ where: { id: id_game } });
}
function checkUserExists(id_user) {
  return model.users.findOne({ where: { id: id_user } });
}

function checkUserGameUnique(id_user, id_game) {
  return model.users_games.findOne({
    where: { id_user: id_user, id_game: id_game },
  });
}
router.post(
  "/:id_user/game",
  [customMiddleware.jwtMiddleware, check("id_game").isNumeric(),check("id_user").isNumeric()],
  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(httpCode.VALIDATION_FAIL)
        .json({ errors: errors.array() });
    }
    if(req.user_auth.tipe != 3 && req.user_auth.id != req.params.id_user){
      return response.forbidden(res, "You don't have enough access to this resource");
    }

    if ((await checkGameExists(req.body.id_game)) == null) {
      return response.notFound(res, "Game not found");
    }
    if (
      (await checkUserGameUnique(req.user_auth.id, req.body.id_game)) != null
    ) {
      return response.duplicate(res, "Duplicate Resource");
    }
    try {
      const data = {
        id_user: parseInt(req.params.id_user) ,
        id_game: req.body.id_game,
      };
      const user_game = await model.users_games.create(data, {
        include: [
          {
            model: model.users,
            as: "user",
            attributes: { exclude: ["password", "token", "tipe"] },
            // attributes: ["name",],
          },
        ],
      });
      if (user_game) {
        return response.insert(
          res,
          "Successfuly inserted user game",
          user_game
        );
      }
    } catch (err) {
      return response.unexpectedError(res, err.message);
    }
  }
);

router.get(
  "/:id_user/game",
  [customMiddleware.jwtMiddleware, check("id_user").isNumeric()],
  async function (req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(httpCode.VALIDATION_FAIL)
          .json({ errors: errors.array() });
      }

      if ((await checkUserExists(req.params.id_user)) == null) {
        return response.notFound(res, "User not found");
      }
      const user_games = await model.users_games.findAll({
        where: {
          id_user: req.params.id_user,
        },
        include: [
          // {
          //   model: model.users,
          //   as: "user",
          //   attributes: { exclude: ["password", "token", "tipe"] },
          //   // attributes: ["name",],
          // },
          "game",
        ],
      });
      return response.get(res, "", user_games);
    } catch (err) {
      return response.unexpectedError(res, err.message);
    }
  }
);

router.delete(
  "/:id_user/game/:id_game",
  [customMiddleware.jwtMiddleware, check("id_game").isNumeric()],
  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(httpCode.VALIDATION_FAIL)
        .json({ errors: errors.array() });
    }

    if ((await checkGameExists(req.params.id_game)) == null) {
      return response.notFound(res, "Game not found");
    }
    if(req.user_auth.tipe != 3 && req.user_auth.id != req.params.id_user){
      return response.forbidden(res, "You don't have enough access to this resource");
    }
    try {
      const data = {
        id_user: req.params.id_user,
        id_game: req.params.id_game,
      };
      let user_game = await model.users_games.findOne({ where: data });
      if (user_game == null) {
        return response.notFound(res, "User Game not found");
      }
      user_game = await user_game.destroy();
      if (user_game) {
        return response.delete(res, "Successfuly deleted user game");
      }
    } catch (err) {
      return response.unexpectedError(res, err.message);
    }
  }
);

module.exports = router;
