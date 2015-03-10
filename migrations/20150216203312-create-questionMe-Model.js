"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
  	migration.createTable("questionme", {
  		id: {
   	  	allowNull: false,
      	autoIncrement: true,
      	primaryKey: true,
      	type: DataTypes.INTEGER
    	},
    	question: {
      	type: DataTypes.STRING
    	},
    	questionAbout: {
      	type: DataTypes.STRING
    	},
      	answer1: {
        type: DataTypes.STRING
	    },
	    answer2: {
        type: DataTypes.STRING
	    },
	    answer3: {
        type: DataTypes.STRING
	    },
	    answer4: {
        type: DataTypes.STRING
	    },
	    answer5: {
        type: DataTypes.STRING
	    },
	    answer6: {
        type: DataTypes.STRING
	    }

  	}).success(done);
    // add altering commands here, calling 'done' when finished
  },

  down: function(migration, DataTypes, done) {
  		migration.dropTable("questionme").success(done);
  	}
};
