"use strict";

module.exports = function(sequelize, DataTypes) {
  var Friends = sequelize.define("friends", {
    numUser1: DataTypes.INTEGER,
    numUser2: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return Friends;
};
