'use strict'

var express = require('express');
var AparadorController = require('../controllers/aparador');

var api = express.Router();

// middleware de autenficación
var md_auth = require('../middlewares/authenticated');

// Middleware para la subida de archivos
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/aparadores/'});

api.get('/aparadorprueba', md_auth.ensureAuth, AparadorController.prueba);
api.post('/guardar-aparador', md_auth.ensureAuth, AparadorController.saveAparador);
api.get('/aparadores', md_auth.ensureAuth, AparadorController.getAparadores);
api.put('/update-aparador/:id', md_auth.ensureAuth, AparadorController.updateAparador);
api.delete('/aparador/:id', md_auth.ensureAuth, AparadorController.deleteAparador);
api.get('/aparadores-user/:id/:page?', md_auth.ensureAuth, AparadorController.getAparadoresByUser);
api.post('/upload-image-aparador/:id', [md_auth.ensureAuth, md_upload], AparadorController.uploadImage);

module.exports = api;