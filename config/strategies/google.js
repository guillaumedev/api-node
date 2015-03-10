// load strategies modules
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// expose this function to our app using module.exports
module.exports = function(passport, flash, models, User) {

  // =========================================================================
  // GOOGLE SIGNUP/SIGNIN ====================================================
  // =========================================================================
  passport.use(new GoogleStrategy({
    clientID        : process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret    : process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL     : process.env.GOOGLE_AUTH_CALLBACK_URL,
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
  function(req, token, refreshToken, profile, done) {
    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(function() {
      if (!req.user) {
        // try to find the user based on their google id
        User.findOne({where: { googleId : profile.id }}).success(function(user) {
          if (user) {
            // if there is a user id already but no token
            // just add our token and profile information
            if (!user.googleToken) {
              user
                .updateAttributes({
                  googleEmail: profile.emails[0].value, // google can return multiple emails so we'll take the first
                  googleName: profile.displayName,
                  googleToken: token // we will save the token that google provides to the user
                })
                .complete(function(err, user) {
                  if (err)
                    throw err;
                  return done(null, user, req.flash('info', 'Hello ' + user.googleName + ', your google account is now linked'));
                })
            }
            return done(null, user, req.flash('info', 'Hello ' + user.googleName)); // user found, return that user
          } else {
            // if the user isnt in our database, create a new user
            User
              .create({
                googleEmail: profile.emails[0].value, // google can return multiple emails so we'll take the first
                googleName: profile.displayName,
                googleId: profile.id, // set the users google id
                googleToken: token // we will save the token that google provides to the user
              })
              .complete(function(err, user) {
                if (err)
                  throw err;
                return done(null, user, req.flash('info', 'Welcome ' + user.googleName));
              })
          }
        });
      } else {
        // user already exists and is logged in, we have to link accounts
        var user = req.user; // pull the user out of the session

        user
          .updateAttributes({
            googleEmail: profile.emails[0].value, // google can return multiple emails so we'll take the first
            googleName: profile.displayName,
            googleId: profile.id, // set the users google id
            googleToken: token // we will save the token that google provides to the user
          })
          .complete(function(err, user) {
            if (err)
              throw err;
            return done(null, user, req.flash('info', 'Your google account is now linked'));
          })
      }
    });
  }));
};