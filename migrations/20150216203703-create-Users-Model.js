"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      username: {
        type: DataTypes.STRING,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      nbVictory: {
        type: DataTypes.INTEGER
      },
      nbDefeat: {
        type: DataTypes.INTEGER
      },
      inscriptionDate: {
        type: DataTypes.DATE
      },
      lat: {
        type: DataTypes.FLOAT
      },
      lng: {
        type: DataTypes.FLOAT
      },
      XP: {
        type: DataTypes.INTEGER
      },
      level: {
        type: DataTypes.INTEGER
      },
      meetcoins: {
        type: DataTypes.INTEGER
      },
      numMeeter: {
        type: DataTypes.INTEGER
      },
      connected: {
        type: DataTypes.INTEGER
      },
      tokenUser: {
        type: DataTypes.STRING
      },
      regId:{
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      resetPasswordToken: {
        type: DataTypes.STRING
      },
      resetPasswordExpires: {
        type: DataTypes.DATE
      },
      facebookId: {
        type: DataTypes.STRING
      },
      facebookToken: {
        type: DataTypes.STRING
      },
      facebookEmail: {
        type: DataTypes.STRING
      },
      facebookName: {
        type: DataTypes.STRING
      },
      googleId: {
        type: DataTypes.STRING
      },
      googleToken: {
        type: DataTypes.STRING
      },
      googleEmail: {
        type: DataTypes.STRING
      },
      googleName: {
        type: DataTypes.STRING
      },
      twitterId: {
        type: DataTypes.STRING
      },
      twitterToken: {
        type: DataTypes.STRING
      },
      twitterDisplayName: {
        type: DataTypes.STRING
      },
      twitterUsername: {
        type: DataTypes.STRING
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
    migration.dropTable("users").success(done);
  }
};