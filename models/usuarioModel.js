require("rootpath")();

const connection = require('../db');


var db = {};


db.create = function (usuario, retorno) {
    const consulta = "INSERT INTO usuario (mail, nickname, password, dni) VALUES (?, ?, ?, ?);";
    const params = [usuario.mail, usuario.nickname, usuario.password, usuario.dni];
  
    connection.query(consulta, params, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          retorno({
            message: `El usuario con nickname ${usuario.nickname} ya fue registrado anteriormente.`,
          });
        } else {
          retorno({
            message: "Error al crear el usuario.",
            detail: err,
          });
        }
      } else {
        retorno(undefined, {
          message: `Se ha creado el usuario "${usuario.nickname} "con DNI ${usuario.dni}.`,
        });
      }
    });
  };
  
  db.getAll = function (retorno) {
    const consulta = "SELECT * FROM usuario";
    connection.query(consulta, (err, rows) => {
      if (err) {
        retorno({
          message: "Error al obtener usuarios.",
          detail: err,
        });
      } else {
        retorno(undefined, rows);
      }
    });
  };
  
  db.update = function (user, id, retorno) {
    const params = [user.mail, user.nickname, user.password, user.dni, id];
    const consulta = "UPDATE usuario SET mail = ?, nickname = ?, password = ?, dni = ? WHERE nickname = ?;";
  
    connection.query(consulta, params, (err) => {
      if (err) {
        retorno({
          message: `Error al actualizar los datos del usuario ${user.nickname}.`,
          detail: err,
        });
      } else {
        retorno({
          message: `Se han actualizado los datos del usuario ${user.nickname}. Email= ${user.mail} Nickname= ${user.nickname} Password= ${user.password} DNI= ${user.dni}`,
        });
      }
    });
  };
  
  db.delete = function (nickname, retorno) {
    connection.query("DELETE FROM usuario WHERE nickname = ?", nickname, (err, result) => {
      if (err) {
        retorno({
          message: `Error al eliminar el usuario "${nickname}".`,
          detail: err,
        });
      } else {
        if (result.affectedRows === 0) {
          retorno(undefined, {
            message: `No se encontró un usuario con el nickname "${nickname}".`,
            detail: result,
          });
        } else {
          retorno(undefined, {
            message: `Se ha eliminado el usuario "${nickname}" correctamente.`,
            detail: result,
          });
        }
      }
    });
  };
  
  db.getByEmail = function (email, retorno) {
    const consulta = "SELECT usuario.nickname FROM usuario WHERE mail = ?;";
    connection.query(consulta, email, (err, result) => {
      if (err) {
        retorno({
          message: "Error al buscar el usuario por email.",
          detail: err,
        });
      } else {
        if (result.length === 0) {
          retorno(`El correo ${email} no existe.`);
        } else {
          if (result[0].nickname) {
            retorno(undefined, {
              message: "Usuario encontrado.",
              result: result,
            });
          } else {
            retorno(`El correo ${email} no tiene usuario.`);
          }
        }
      }
    });
  };
  
  
  
  module.exports = db;