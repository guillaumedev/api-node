"use strict";

module.exports = function(sequelize, DataTypes) {
  var Meeter = sequelize.define("meeter", {
    pathMeeter: DataTypes.STRING,
    publicMeeter: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return Meeter;
};
