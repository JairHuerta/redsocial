'use strict'

var path = require('path');
var fs = require('fs'); // librería de NodeJS para trabajar con arvhivos
var mongoosePaginate = require('mongoose-pagination');



var User = require('../models/user');
var Aparador = require('../models/aparador');

/*** Método de prueba ***/
function prueba(req, res){
	res.status(200).send({message: 'Hola mundo desde el controlador de Aparadores'});
}

/*** Método para registrar un nuevo aparador ***/
function saveAparador(req, res){
	var params = req.body;

	if(!params.nombre) return res.status(200).send({message: 'ERROR: Debes escribir un nombre al aparador'});
	var aparador = new Aparador();
	aparador.nombre = params.nombre;
	aparador.descripcion = null;
	aparador.calleynumero = null;
	aparador.colonia = null;
	aparador.delegacion = null;
	aparador.estado = null;
	aparador.codigopostal = null;
	aparador.categoria = null;
	aparador.etiquetas = null;
	aparador.enlace1 = null;
	aparador.enlace2 = null;
	aparador.enlace3 = null;
	aparador.enlace4 = null;
	aparador.telefono1 = null;
	aparador.telefono2 = null;
	aparador.telefono3 = null;
	aparador.telefono4 = null;
	aparador.entresemana = null;
	aparador.findesemana = null;
	aparador.user = req.user.sub;

	aparador.save((err, aparadorStored) => {
		if(err) return res.status(500).send({message: 'ERROR al guardar el aparador!!!'});
		if(!aparadorStored) return res.status(404).send({message: 'ERROR: no se ha guardado el aparador, intenta de nuevo'});

		return res.status(200).send({aparadorStored});
	});
}

/*** Metodo para listado de aparadores ***/
function getAparadores(req, res){
	var identity_user_id = req.user.sub;

	var page = 1; // nos indica en que página estamos, por defecto la 1
	if (req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 9;
	Aparador.find().sort('_id').paginate(page, itemsPerPage, (err, aparadores, total) => {
		if(err) return res.status(500).send({message: 'Error en la petición!!'});
		if(!aparadores) return res.status(404).send({message: 'No hay usuarios disponibles!!'});

			return res.status(200).send({
				aparadores : aparadores,	// --> se puede poner solo users, pq no cambiamos el nombre
				total: total
			});
	});
}

/** Metodo para actualizar un aparador **/
function updateAparador(req, res){
	var aparador_id = req.params.id;
	var update = req.body;

	Aparador.findByIdAndUpdate(aparador_id, update, {new:true},(err, aparadorUpdated) => {
		if(err) return res.status(500).send({message:'Error al actualizar aparador'})
		if(!aparadorUpdated) return res.status(404).send({message:'No se puede actualizar el aparador'})

		return res.status(200).send({aparador: aparadorUpdated});
	});
}

function deleteAparador(req, res){
	var aparador_id = req.params.id;

	Aparador.findOneAndRemove({user: req.user.sub, '_id':aparador_id},(err, aparadorRemoved) => {
		if(err) return res.status(500).send({message: 'ERROR al borrar la publicacion!!!'});
		if(!aparadorRemoved) res.status(404).send({message: 'NO se ha borrado la publicación!! Comprueba que seas su autor.'});

		return res.status(200).send({message: 'Aparador eliminado correctamente'});
	});
}
/*Devolver aparadores por usuario */
function getAparadoresByUser(req, res){
	var user_id;
	var page = 1;

	if(!req.params.id){
		return res.status(500).send({message: 'ERROR al devolver aparadores!!!'});
	}else{
		user_id  = req.params.id;
	}
	if(req.params.page){
		page = req.params.page;
	}

	var items_per_page = 5;

	Aparador.find({user: user_id}).populate('user', 'name surname image _id').paginate(page, items_per_page, (err, aparadores, total) => {
		if(err) return res.status(500).send({message: 'ERROR al devolver aparadores!!!'});
		if(total == 0) return res.status(404).send({message: 'NO hay no hay aparadores de este usuario'});

		return res.status(200).send({
			total_items: total,
			pages: Math.ceil(total/items_per_page),
			page: page,
			items_per_page: items_per_page,
			aparadores
		})
	});
}

/* Metodo para subir imagen de perfil de aparador */
function uploadImage(req, res){
	var aparadorId = req.params.id;

	if(req.files){ //comprobamos que hay archivos para subir
		//console.log(req.files);
		var file_path = req.files.image.path;
		//console.log(file_path);
		var file_split = file_path.split('\\'); // devuelve un array con los elementos separados donde había una '\'
		//console.log(file_split);

		var file_name = file_split[2];
		//console.log(file_name);

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];
		//console.log(file_ext);


		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
			//console.log('Extensión válida nos ponemos a trabajar...');
			Aparador.findByIdAndUpdate(aparadorId, {image: file_name}, {new:true}, (err, aparadorUpdated) => {
				if(err) return res.status(500).send({message: 'Error en la petición!!'});
				if(!aparadorUpdated) return res.status(404).send({message: 'NO se ha podido actualizar el aparador!!'});

				return res.status(200).send({user: aparadorUpdated});
			});

		}

	} else {
		return res.status(200).send({message: 'NO se han subido archivos!!!'});
	}
}

/*** Método para mostrar imagen del aparador ***/
function getImageFile(req, res){
	var image_file = req.params.imageFile;
	var path_file = './uploads/aparadores/'+image_file;

	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'NO existe la imagen!!!'});
		}
	});
}


module.exports = {
	prueba,
	saveAparador,
	getAparadores,
	updateAparador,
	deleteAparador,
	getAparadoresByUser,
	uploadImage,
	getImageFile
}

