'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AparadorSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    nombre: String,
    descripcion: String,
    calleynumero: String,
    colonia: String,
    delegacion: String,
    estado: String,
    codigopostal: String,
    categoria: String,
    etiquetas: String,
    enlace1: String,
    enlace2: String,
    enlace3: String,
    enlace4: String,
    telefono1: String,
    telefono2: String,
    telefono3: String,
    telefono4: String,
    entresemana: String,
    findesemana: String,
    image: String
});

module.exports = mongoose.model('Aparador', AparadorSchema);