"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("shophistories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      numUser: {
        type: DataTypes.INTEGER
      },

      numPurchase: {
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
    migration.dropTable("shophistories").success(done);
  }
};