"use strict";

module.exports = function(sequelize, DataTypes) {
  var answerToQuestionMe = sequelize.define("answerToQuestionMe", {
    idUser: DataTypes.INTEGER,
    idQuestion:DataTypes.INTEGER,
    answer: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return answerToQuestionMe;
};
