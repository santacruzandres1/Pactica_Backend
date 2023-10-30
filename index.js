require('rootpath')();
const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));    
morgan(':method :url :status :res[content-length] - :response-time ms');

const configuracion = require("configDB.json");
const controladorPersona = require("controllers/personaController.js");
const controladorUsuario = require("controllers/usuarioController.js");

app.use('/api/persona', controladorPersona);
app.use('/api/usuario', controladorUsuario);


app.listen(configuracion.server.port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Servidor escuchando en el puerto " + configuracion.server.port);
    }
});