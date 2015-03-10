"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("defy", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      idUser1: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      idUser2: {
      	type: DataTypes.INTEGER,
      	allowNull:false
      },

      nGame: {
        type: DataTypes.INTEGER,
        allowNull:false
      },

      stateGame: {
        type: DataTypes.INTEGER,
        allowNull:false
      },

      createdAt: {
      	type: DataTypes.DATE,
      	allowNull:false
      }
    }).success(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("defy").success(done);
  }
};