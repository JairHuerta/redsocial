'use strict'

//var path = require('path');
//var fs = require('fs'); // librería de NodeJS para trabajar con arvhivos
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Like = require('../models/like');

/*** Método de prueba ***/
function likeprueba(req, res){
	res.status(200).send({message: 'Hola mundo desde el controlador de Likes'});
}

/*** Dar like a una publicación ***/
function likePublication(req, res){
	var params = req.body;

	var like = new Like();
	like.user = req.user.sub;
	like.publication = params.publication;

	Like.findOne({user:Like.user, publication:like.publication}, (err, result) => { // evitamos duplicados
		if(err) return res.status(500).send({message: 'ERROR al dar Like '});
		if(result) return res.status(200).send({message: 'Ya diste like a esta publicación!!!'});
		like.save((err, likeStored) => {
			if(err) return res.status(500).send({message: 'ERROR al guardar el like!!!'});
			if(!likeStored) return res.status(404).send({message: 'ERROR el like no se ha guardado!!!'});

			return res.status(200).send({like: likeStored});
		});
	});
}

/*** Metodo para quitar el like de una publicación (Pasa el id de la publicación por el postman, no el _id)***/
function deleteLike(req, res){
	var user_id = req.user.sub;
	var publication_id = req.params.id;

	Like.find({'user':user_id, 'publication':publication_id}).remove(err => {
		if(err) return res.status(500).send({message: 'ERROR al borrar el like'});
		return res.status(200).send({message: 'El Like se ha eliminado'});
	});
}

/*** Método no paginado para listar los likes que he dado ***/
function getLikesForPublications(req, res){
	var user_id = req.user.sub;

	Like.find({user: user_id}).populate('user publication', '_id name surname nick').exec((err, likes) => {
		if(err) return res.status(500).send({message: 'ERROR en el servidor!!!'});
		if(likes.length == 0) return res.status(404).send({message: 'No hay likes registrados'});

		return res.status(200).send({likes});
	});
}

function getLike(req, res){
	var user_id = req.user.sub;

	if(req.params.id){
		user_id = req.params.id;
	}

	getCountLike(user_id).then((stats) => {
		return res.status(200).send(stats);
	});
}

async function getCountLike(publication_id){
	try{
		var likes = await Like.count({'publication':publication_id}).exec()
		.then((count) => {
			return count;
		})
		.catch((err) => {
			return handleError(err);
		});

		return {
			likes: likes
		}
	} catch(e){
		console.log(e);
	}
}


module.exports = {
	likeprueba,
	likePublication,
	deleteLike,
	getLikesForPublications,
	getLike,
	getCountLike
}