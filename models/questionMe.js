"use strict";

module.exports = function(sequelize, DataTypes) {
  var QuestionMe = sequelize.define("questionme", {
    question: DataTypes.STRING,
    questionAbout: DataTypes.STRING,
    answer1: DataTypes.STRING,
    answer2: DataTypes.STRING,
    answer3: DataTypes.STRING,
    answer4: DataTypes.STRING,
    answer5: DataTypes.STRING,
    answer6: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return QuestionMe;
};
