'use strict'

var express = require('express');
var LikeController = require('../controllers/like');

var api = express.Router();

// middleware de autenficación
var md_auth = require('../middlewares/authenticated');

api.get('/likesprueba', md_auth.ensureAuth, LikeController.likeprueba);
api.post('/like', md_auth.ensureAuth, LikeController.likePublication);
api.delete('/like/:id?', md_auth.ensureAuth, LikeController.deleteLike);
api.get('/likes-for-publications/:id?', md_auth.ensureAuth, LikeController.getLike);
api.get('/counters-likes/:id?', md_auth.ensureAuth, LikeController.getCountLike);


module.exports = api;