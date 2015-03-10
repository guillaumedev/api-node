"use strict";

module.exports = function(sequelize, DataTypes) {
  var ShopHistory = sequelize.define("shophistory", {
    numUser: DataTypes.INTEGER,
    numPurchase: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return ShopHistory;
};
