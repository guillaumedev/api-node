"use strict";

module.exports = function(sequelize, DataTypes) {
  var Drawsmt = sequelize.define("drawsmt", {
    word: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return Drawsmt;
};
