const mysql = require("mysql");
const config = require("./configDB.json");

var connection = mysql.createConnection(config.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Base de datos conectada con éxito");
    }
});

module.exports = connection;
