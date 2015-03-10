// load strategies modules
var LocalStrategy   = require('passport-local').Strategy;
var Sequelize = require("sequelize");

// expose this function to our app using module.exports
module.exports = function(passport, flash, models, User) {

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================

  passport.use('local-login', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) { // callback with email and password from our form

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ where: { username: username }}).success(function(user) {
        if (!user) {
          console.log('Unknown user');
          return done(null, false, req.flash('info', 'Unknown user'));
        } else if (!User.build().validPassword(password, user)) {
          console.log('Invalid password');
          return done(null, false, req.flash('info', 'Invalid password'));
        } else {
          console.log(req.body);
          models.sequelize.query('UPDATE Users set regId=:regId WHERE id =:id;', null, {raw: true}, { regId: req.body.regId, id: user.id});
          console.log('Welcome '+ user.username);
          return done(null, user, req.flash('info', 'Hello '+ user.username));
        }
      }).error(function(err){
        return done(err);
      });

  }));

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================

  passport.use('local-signup', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) {
      // asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function() {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ where: Sequelize.or({ username:  username }, { email: req.body.email })}).success(function(existingUser) {
            // check to see if theres already a user with that email
            if (existingUser) {
                console.log('That email or username have already an account');
                return done(null, false, req.flash('info', 'That email or username have already an account'));
            }

            // If we're logged in, we're connecting a new local account.
            if(req.user) {
              var user = req.user;
              user
                .updateAttributes({
                  username: username,
                  email: req.body.email,
                  password: User.build().generateHash(password)
                })
                .complete(function(err, user) {
                  if (err)
                    throw err;
                  return done(null, user, req.flash('info', 'Local account linked'));
                })
            } else {
              // if there is no user with that email & username
              // save the user
              User
                .create({
                  username: username,
                  email: req.body.email,
                  password: User.build().generateHash(password),
                  tokenUser: User.build().generateHash(username),
                  numMeeter: 1
                })
                .complete(function(err, user) {
                  if (err)
                    throw err;
                  return done(null, user, req.flash('info', 'Welcome '+ user.username));
                })
            }
        });
      });
  }));
};