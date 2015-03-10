// load strategies modules
var TwitterStrategy  = require('passport-twitter').Strategy;

// expose this function to our app using module.exports
module.exports = function(passport, flash, models, User) {

  // =========================================================================
  // TWITTER SIGNUP/SIGNIN ===================================================
  // =========================================================================
  passport.use(new TwitterStrategy({
    consumerKey     : process.env.TWITTER_AUTH_CONSUMER_KEY,
    consumerSecret  : process.env.TWITTER_AUTH_CONSUMER_SECRET,
    callbackURL     : process.env.TWITTER_AUTH_CALLBACK_URL,
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  },
  function(req, token, tokenSecret, profile, done) {
  // make the code asynchronous
  // User.findOne won't fire until we have all our data back from Twitter
    process.nextTick(function() {
      if (!req.user) {
        User.findOne({where: { twitterId : profile.id }}).success(function(user) {
          if (user) {
            // if there is a user id already but no token
            // just add our token and profile information
            if (!user.twitterToken) {
              user
                .updateAttributes({
                  twitterUsername: profile.username, // google can return multiple emails so we'll take the first
                  twitterDisplayName: profile.displayName,
                  twitterToken: token // we will save the token that google provides to the user
                })
                .complete(function(err, user) {
                  if (err)
                    throw err;
                  return done(null, user, req.flash('info', 'Hello ' + user.twitterUsername + ', your twitter account is now linked'));
                })
            }
            return done(null, user, req.flash('info', 'Hello ' + user.twitterUsername)); // user found, return that user
          } else {
            // if the user isnt in our database, create a new user
            User
              .create({
                twitterUsername: profile.username, // google can return multiple emails so we'll take the first
                twitterDisplayName: profile.displayName,
                twitterId: profile.id, // set the users google id
                twitterToken: token // we will save the token that google provides to the user
              })
              .complete(function(err, user) {
                if (err)
                  throw err;
                return done(null, user, req.flash('info', 'Welcome ' + user.twitterUsername));
              })
          }
        });
      } else {
        // user already exists and is logged in, we have to link accounts
        var user = req.user; // pull the user out of the session

        user
          .updateAttributes({
            twitterUsername: profile.username, // google can return multiple emails so we'll take the first
            twitterDisplayName: profile.displayName,
            twitterId: profile.id, // set the users google id
            twitterToken: token // we will save the token that google provides to the user
          })
          .complete(function(err, user) {
            if (err)
              throw err;
            return done(null, user, req.flash('info', 'Your twitter account is now linked'));
          })
      }
    });
  }));
};