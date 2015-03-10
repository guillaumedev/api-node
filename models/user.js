"use strict";

//load bcrypt module
var bcrypt   = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("user", {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    nbVictory: DataTypes.INTEGER,
    nbDefeat: DataTypes.INTEGER,
    inscriptionDate: DataTypes.DATE,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    xp: DataTypes.INTEGER,
    level: DataTypes.INTEGER,
    meetcoins: DataTypes.INTEGER,
    numMeeter: DataTypes.INTEGER,
    connected: DataTypes.INTEGER,
    tokenUser: DataTypes.STRING,
    regId: DataTypes.STRING,
    password: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE,
    facebookId: DataTypes.INTEGER,
    facebookToken: DataTypes.STRING,
    facebookEmail: DataTypes.STRING,
    facebookName: DataTypes.STRING,
    twitterId: DataTypes.INTEGER,
    twitterToken: DataTypes.STRING,
    twitterDisplayName: DataTypes.STRING,
    twitterUsername: DataTypes.STRING,
    googleId: DataTypes.INTEGER,
    googleToken: DataTypes.STRING,
    googleEmail: DataTypes.STRING,
    googleName: DataTypes.STRING

  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      validPassword: function(password, user) {
        return bcrypt.compareSync(password, user.password);
      },
      generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      }
    }
  });

  return User;
};
