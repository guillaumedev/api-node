"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("meeters", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      pathMeeter: {
        type: DataTypes.STRING
      },
      publicMeeter: {
        type: DataTypes.BOOLEAN
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
    migration.dropTable("meeters").success(done);
  }
};