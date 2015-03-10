"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("friends", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      numUser1: {
        type: DataTypes.INTEGER
      },
      numUser2: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).success(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("friends").success(done);
  }
};