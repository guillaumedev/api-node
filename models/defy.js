"use strict";

module.exports = function(sequelize, DataTypes) {
  var Defy = sequelize.define("defy", {
    idUser1: DataTypes.INTEGER,
    idUser2: DataTypes.INTEGER,
    nGame: DataTypes.INTEGER,
    stateGame: DataTypes.INTEGER,
    createdAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return Defy;
};
