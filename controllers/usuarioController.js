require("rootpath")();
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var db = require("../models/usuarioModel.js");


app.get('/', getAllUser);
app.post('/', createUser);
app.put('/:nickname', updateUser);
app.delete('/:nickname', deleteUser);
app.get("/:mail", getByEmail)




function getAllUser(req, res) {
    db.getAll((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function createUser(req, res) {
    let user = req.body;
    db.create(user, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}


function updateUser(req, res) {
    let data_user = req.body;
    let id_user = req.params.nickname
    db.update(data_user, id_user, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado)
        }
    })
}


function deleteUser(req, res) {
    let delete_user = req.params.nickname;
    db.delete(delete_user, (err, result_model) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result_model.detail.affectedRows == 0) {
                res.status(404).send(result_model.message);
            } else {
                res.send(result_model.message);
            }
        }
    });
}


function getByEmail(req, res) {
    db.getByEmail(req.params.mail, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}


module.exports = app;



