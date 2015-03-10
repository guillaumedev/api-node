// load strategies modules
var FacebookStrategy = require('passport-facebook').Strategy;

// expose this function to our app using module.exports
module.exports = function(passport, flash, models, User) {
  // =========================================================================
  // FACEBOOK SIGNUP/SIGNIN ============================================================
  // =========================================================================

  passport.use(new FacebookStrategy({
    // pull in our app id and secret from our auth.js file
    clientID        : process.env.FACEBOOK_AUTH_CLIENT_ID,
    clientSecret    : process.env.FACEBOOK_AUTH_CLIENT_SECRET,
    callbackURL     : process.env.FACEBOOK_AUTH_CALLBACK_URL,
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },

  // facebook will send back the token and profile
  function(req, token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {
      if (!req.user) {
        // find the user in the database based on their facebook id
        User.findOne({where: { facebookId : profile.id }}).success(function(user) {
          if (user) {
            // if there is a user id already but no token
            // just add our token and profile information
            if (!user.facebookToken) {
              user
                .updateAttributes({
                  facebookEmail: profile.emails[0].value, // facebook can return multiple emails so we'll take the first
                  facebookName: profile.name.givenName + ' ' + profile.name.familyName,
                  facebookToken: token // // we will save the token that facebook provides to the user
                })
                .complete(function(err, user) {
                  if (err)
                    throw err;
                  return done(null, user, req.flash('info', 'Hello ' + user.facebookName + ', your facebook account is now linked'));
                })
            }
            return done(null, user, req.flash('info', 'Hello ' + user.facebookName)); // user found, return that user
          } else {
            User
              .create({
                facebookEmail: profile.emails[0].value, // facebook can return multiple emails so we'll take the first
                facebookName: profile.name.givenName + ' ' + profile.name.familyName,
                facebookId: profile.id, // set the users facebook id
                facebookToken: token // // we will save the token that facebook provides to the user
              })
              .complete(function(err, user) {
                if (err)
                  throw err;
                return done(null, user, req.flash('info', 'Welcome ' + user.facebookName));
              })
          }
        });
      } else {
        // user already exists and is logged in, we have to link accounts
        var user = req.user; // pull the user out of the session

        user
          .updateAttributes({
            facebookEmail: profile.emails[0].value, // facebook can return multiple emails so we'll take the first
            facebookName: profile.name.givenName + ' ' + profile.name.familyName,
            facebookId: profile.id, // set the users facebook id
            facebookToken: token // // we will save the token that facebook provides to the user
          })
          .complete(function(err, user) {
            if (err)
              throw err;
            return done(null, user, req.flash('info', 'Your facebook account is now linked'));
          })
      }
    });
  }));
};