"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("drawsmt", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      word: {
        type: DataTypes.STRING
      }
    }).success(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("drawsmt").success(done);
  }
};