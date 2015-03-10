"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("answerToQuestionMe", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      idUser: {
        type: DataTypes.INTEGER
      },
      idQuestion: {
        type: DataTypes.STRING
      },
      answer: {
        type: DataTypes.STRING
      }
    }).success(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("answerToQuestionMe").success(done);
  }
};