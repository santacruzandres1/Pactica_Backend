require("rootpath")();

const connection = require('../db');


var db = {};
// Crear persona
db.create = function (datos, resultado) {
    const consulta = "INSERT INTO persona (dni, nombre, apellido) VALUES (?, ?, ?);";
    const params = [datos.dni, datos.nombre, datos.apellido];
  
    connection.query(consulta, params, (err, rows) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          resultado({
            message: `La persona con DNI ${datos.dni} ya fue registrada anteriormente.`,
            detail: err,
          });
        } else {
          resultado({
            message: "Error al crear la persona.",
            detail: err,
          });
        }
      } else {
        resultado(undefined, {
          message: `Se ha creado la persona "${datos.nombre} ${datos.apellido}" con DNI: ${datos.dni}.`,
          detail: rows,
        });
      }
    });
  };
  
  // Obtener personas
  db.getAll = function (resultado) {
    const consulta = "SELECT * FROM persona";
    connection.query(consulta, (err, rows) => {
      if (err) {
        resultado({
          message: "Error al obtener las personas.",
          detail: err,
        });
      } else {
        resultado(undefined, rows);
      }
    });
  };
  
  // Actualizar persona por DNI
  db.update = function (datos, dni, retorno) {
    const consulta = "UPDATE persona SET dni = ?, nombre = ?, apellido = ? WHERE dni = ?;";
    const params = [datos.dni, datos.nombre, datos.apellido, dni];
  
    connection.query(consulta, params, (err, result) => {
      if (err) {
        retorno({
          message: "Error al actualizar los datos de la persona.",
          detail: err,
        });
      } else if (result.affectedRows === 0) {
        retorno({
          message: "No existe persona que coincida con el criterio de búsqueda.",
          detail: result,
        });
      } else {
        retorno(undefined, {
          message: `Se han modificado los datos de la persona a: Nombre= ${datos.nombre}, Apellido= ${datos.apellido}, DNI= ${datos.dni} .`,
          detail: result,
        });
      }
    });
  };
  
  // Borrar persona por DNI
  db.delete = function (dni, resultado) {
    const consulta = "DELETE FROM persona WHERE dni = ?;";
    connection.query(consulta, dni, (err, result) => {
      if (err) {
        resultado({
          message: "Error al eliminar la persona.",
          detail: err,
        });
      } else {
        if (result.affectedRows === 0) {
          resultado(undefined, {
            message: "No se encontró una persona con el DNI ingresado.",
            detail: result,
          });
        } else {
          resultado(undefined, {
            message: "Persona eliminada correctamente.",
            detail: result,
          });
        }
      }
    });
  };
  
  // Buscar persona por apellido
  db.getByApellido = function (apellido, resultado) {
    const consulta = "SELECT * FROM persona WHERE apellido = ?;";
    connection.query(consulta, apellido, (err, result) => {
      if (err) {
        resultado({
          message: "Error al buscar personas por apellido.",
          detail: err,
        });
      } else if (result.length === 0) {
        resultado(undefined, {
          message: "No se encontró ninguna persona con el apellido buscado.",
          detail: result,
        });
      } else {
        resultado(undefined, {
          message: `Se han encontrado personas con el apellido ${apellido}.`,
          detail: result,
        });
      }
    });
  };
  
  db.getNickname = function (dni, resultado) {
    const consultaExistencia = "SELECT COUNT(*) as count FROM persona WHERE dni = ?;";
    connection.query(consultaExistencia, dni, (err, existenciaResult) => {
      if (err) {
        resultado({
          message: `Error al verificar la existencia del DNI ${dni}.`,
          detail: err,
        });
      } else {
        if (existenciaResult[0].count === 0) {
          resultado(`El DNI ${dni} no existe.`);
        } else {
          const consultaNickname = "SELECT usuario.nickname FROM usuario INNER JOIN persona ON usuario.dni = persona.dni WHERE persona.dni = ?;";
          connection.query(consultaNickname, dni, (err, nicknameResult) => {
            if (err) {
              resultado({
                message: `No se pudo encontrar el nickname del usuario con el DNI ${dni}.`,
                detail: err,
              });
            } else {
              if (nicknameResult.length > 0) {
                resultado(`El nickname del usuario con DNI ${dni} es: ${nicknameResult[0].nickname}`);
              } else {
                resultado(`La persona con DNI ${dni} no tiene un usuario.`);
              }
            }
          });
        }
      }
    });
  };
  
  module.exports = db;