"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("mail", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      mail: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }).success(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("mail").success(done);
  }
};