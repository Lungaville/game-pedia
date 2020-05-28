var express = require("express");
var router = express.Router();
var httpCode = require("../utils/http-code");
var customValidation = require("../utils/custom_validation");
var customMiddleware = require("../utils/custom_middleware");
var response = require("../utils/response_function");
var multer = require("multer")
const model = require("../models/index");
const igdb = require('igdb-api-node').default;
var Sequelize = require('sequelize');

const { check, validationResult } = require("express-validator");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./images");
  },
  filename: (req, file, callback) => {
    const filename = file.originalname.split(".");
    const extension = filename[1];
    const filetypes= /jpeg|jpg|png/;
    const mimetype=filetypes.test(file.mimetype);
    if(mimetype)callback(null, Date.now() + "." + extension);
    else callback('Error: Image Only')
  }
});
const upload = multer({
  storage: storage
});

function checkSlugExists(slug) {
  return model.games.findOne({ where: { slug: slug } });
}
router.post(
  "/",
  upload.single("photo"),
  [
    customMiddleware.jwtMiddleware,
    customMiddleware.minimumPro,
    check("name").isString(),
    check("description").isString(),
    check("genre").isArray(),
    check("slug").isString().isSlug(),
  ],
  async function (req, res, next) {
    const errors = validationResult(req);
    const image = req.file == undefined ? null : (req.file.path).replace("images\\","")
    if(await checkSlugExists(req.body.slug) !=null){
      response.duplicate(res,"Slug already exists")
    }
    const body = {
      ...req.body,
      created_by:parseInt(req.user_auth.id),
      image: image
    }
    if (!errors.isEmpty()) {
      return res
        .status(httpCode.VALIDATION_FAIL)
        .json({ errors: errors.array() });
    }
    try {
      const queryGames = await model.games.create(body);
      const game = await model.games.findOne({
        where: {
          id: queryGames.id,
        },
      });
      for(genre of req.body.genre){
        const queryGenre = await model.genre_games.create({
          id_game: game.id,
          id_genre: genre,
        });
      }
      const game_select = await model.games.findOne({
        where: {
          id: queryGames.id,
        },
        include: 'genre'
      });

      if (game_select) {
        res.status(201).json({
          status: "OK",
          message: "Game berhasil ditambahkan",
          data: game_select,
        });
      }
    } catch (err) {
      res.status(400).json({
        status: "ERROR",
        message: err.message,
        data: {},
      });
    }
  }
);

router.get("/", async function (req, res, next) {
  console.log(req.query.q);
  if(req.query.q !=undefined && req.query.q != ""){
    console.log("tes");
    const response = await igdb("f242556c12ac37ed908b6751edd2fb9a")
    .fields('genres.*,screenshots.*,name,slug,summary')
    .limit(10)
    .search(req.query.q) 
    .request('/games'); 
    
    var data = response.data;
    for (const item of data) {
      let imageLink = "";
      if(item.screenshots != undefined ){
        imageLink= item.screenshots[0].url;
      }
      const [game,created] = await model.games.findOrCreate({where:{slug : item.slug}, defaults : {slug : item.slug, name: item.name, created_by : 0, description: item.summary, image: imageLink} });
      if( created && item.genres != undefined ){ 
        for(const genre of item.genres){
          const [select_genre,created] = await model.genres.findOrCreate({where:{slug : genre.slug}, defaults : {slug : genre.slug, name: genre.name, id_ogdb : genre.id} });
          const seed_genre_game_ogdb = await model.genre_games.create({
            id_game: game.id,
            id_genre: select_genre.id,
          });
        }
      }
    }
  }
  whereParam = {}
  if(req.query.q !=undefined && req.query.q != "") whereParam.name = {[Sequelize.Op.like]: "%"+req.query.q+"%"};
  const games = await model.games.findAll({
    include : "genre",
    where : whereParam
  });
  // console.log(res.locals.user);
  return res.json({
    status: "OK",
    message: "",
    data: games,
  });
});

router.get("/:id", async function (req, res, next) {
  try {
    const gameId = req.params.id;
    const game = await model.games.findOne({
      where: {
        id: gameId,
      },
      include: "genre"
    });
    if (game) {
      res.json({
        status: "OK",
        data: game,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "ERROR",
      message: err.message,
    });
  }
});

module.exports = router;
