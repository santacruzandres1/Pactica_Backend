
require("rootpath")();
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var db = require("../models/personaModel.js");




app.get('/', getAllPerson);
app.post('/', createPerson);
app.put('/:dni', updatePerson);
app.delete('/:dni', deletePerson);
app.get('/:apellido', getByApellido);
app.get("/nickname/:dni", getNick);




function getAllPerson( req, res) {
    db.getAll(function (err, resultado) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}



function createPerson(req, res) {
    let person = req.body;
    db.create(person, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}


function updatePerson(req, res) {
    let person = req.body;
    let id = req.params.dni;
    db.update(person, id, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}



function deletePerson(req, res) {
    let id_person = req.params.dni;
    db.delete(id_person, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (resultado.detail.affectedRows == 0) {
                res.status(404).send(resultado.message);
            } else {
                res.send(resultado.message);
            }
        }
    });
}



function getByApellido(req, res) {
    db.getByApellido(req.params.apellido, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}   


function getNick(req, res) {
    db.getNickname(req.params.dni, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    }
    );
}



module.exports = app;

