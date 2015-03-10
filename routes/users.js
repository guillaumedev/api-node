var express = require('express');
var router = express.Router();
var passport = require('passport');
var userController = require('../controllers/user');
var socketController = require('../controllers/socket');
var models = require("../models");

// =====================================
// LOGIN PAGE ==========================
// =====================================

router.route('/login')
  // show the login form
  .get(function(req, res) {
    res.render('pages/login.ejs', { message: req.flash('info') });
  })
  // process the login form
  .post(function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) { res.end(JSON.stringify({ result: -1 }));}
      if (!user) { res.end(JSON.stringify({ result: 0 })); }
      req.login(user, function(err) {
        if (err) { res.end(JSON.stringify({ result: -1 })); }
        else{
          // models.sequelize.query('UPDATE Users set regId=:regId WHERE id =:id;', null, {raw: true}, { regId: req.params.regId, id: user.id});
          res.end(JSON.stringify({ id: user.id, pseudoUser: user.username, nMeeter: user.numMeeter, token:user.tokenUser }));
         // });
        }
      });
    })(req, res, next);
  });

// =====================================
// SIGNUP PAGE =========================
// =====================================

router.route('/signup')
  // show the signup form
  .get(function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('pages/signup.ejs', { message: req.flash('info') });
  })
  // process the signup form
  .post(function(req, res, next){
    passport.authenticate('local-signup', function(err, user, info) {
      // successRedirect : '/users/profile',
      // failureRedirect : '/users/signup',
      // failureFlash : true,
      // successFlash: true
      if (err) { res.end(JSON.stringify({ result: -1 })); }
      if (!user) { res.end(JSON.stringify({ result: 0 })); }
      req.login(user, function(err) {
        if (err) { res.end(JSON.stringify({ result: -1 })); }
        res.end(JSON.stringify({ result: 1 }));
      }); 
    })(req, res, next);
  });

// =====================================
// RESET PASSWORD ======================
// =====================================
router.route('/forgot')
  .get(function(req, res) {
    res.render('pages/forgot.ejs', {
      user: req.user,
      message: req.flash('info')
    });
  })
  .post(userController.resetPassword);


router.route('/reset/:token')
  .get(userController.matchToken)
  .post(userController.updatePassword);




// =====================================
// FACEBOOK ROUTES =====================
// =====================================
// route for facebook authentication and login
router.route('/auth/facebook')
  .get(
    passport.authenticate('facebook', {
      scope : 'email'
    })
  );

// handle the callback after facebook has authenticated the user
router.route('/auth/facebook/callback')
  .get(
    passport.authenticate('facebook', {
      successRedirect : '/users/profile',
      failureRedirect : '/',
      failureFlash : true,
      successFlash: true
    })
  );

// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
router.route('/auth/google')
  .get(
    passport.authenticate('google', {
      scope : ['profile', 'email']
    })
  );

// the callback after google has authenticated the user
router.route('/auth/google/callback')
  .get(
    passport.authenticate('google', {
      successRedirect : '/users/profile',
      failureRedirect : '/',
      failureFlash : true,
      successFlash: true
    })
  );

// =====================================
// TWITTER ROUTES ======================
// =====================================
// route for twitter authentication and login
router.route('/auth/twitter')
  .get(
    passport.authenticate('twitter')
  );

// handle the callback after twitter has authenticated the user
router.route('/auth/twitter/callback')
  .get(
    passport.authenticate('twitter', {
      successRedirect : '/users/profile',
      failureRedirect : '/',
      failureFlash : true,
      successFlash: true
    })
  );

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.route('/profile')
  .get(userController.isLoggedIn, function(req, res) {
    res.render('pages/profile.ejs', { user : req.user, message: req.flash('info') }); // get the user out of session and pass to template
  })
  .post(userController.changePassword, function(req, res){
    res.render('pages/profile.ejs', { user: req.user, message: req.flash('info') });
  });

// =====================================
// DELETE ==============================
// =====================================
router.route('/delete')
  .get(userController.deleteAccount, function(req, res) {
    res.render('pages/index.ejs', { message: req.flash('info') });
  });

// =====================================
// LOGOUT ==============================
// =====================================
router.route('/logout')
  .get(
    function(req, res) {
      req.logout();
      res.redirect('/');
    }
  );

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

// locally --------------------------------
router.route('/connect/local')
  .get(
    function(req, res) {
      res.render('pages/connect-local.ejs', { message: req.flash('info') });
    }
  )
  .post(
    passport.authenticate('local-signup', {
      successRedirect : '/users/profile', // redirect to the secure profile section
      failureRedirect : '/users/connect/local', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    })
  );

// facebook -------------------------------
// send to facebook to do the authentication
router.route('/connect/facebook')
  .get(
    passport.authorize('facebook', {
      scope : 'email'
    })
  );

// handle the callback after facebook has authorized the user
router.route('/connect/facebook/callback')
  .get(
    passport.authorize('facebook', {
      successRedirect : '/users/profile',
      failureRedirect : '/'
    })
  );

// twitter --------------------------------
// send to twitter to do the authentication
router.route('/connect/twitter')
  .get(
    passport.authorize('twitter', {
      scope : 'email'
    })
  );

// handle the callback after twitter has authorized the user
router.route('/connect/twitter/callback')
  .get(
    passport.authorize('twitter', {
      successRedirect : '/users/profile',
      failureRedirect : '/'
    })
  );

// google ---------------------------------
// send to google to do the authentication
router.route('/connect/google')
  .get(
    passport.authorize('google', {
      scope : ['profile', 'email']
    })
  );

// the callback after google has authorized the user
router.route('/connect/google/callback')
  .get(
    passport.authorize('google', {
      successRedirect : '/users/profile',
      failureRedirect : '/'
    })
  );

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

// local -----------------------------------
router.route('/unlink/local')
  .get(userController.unlinkLocal);

// facebook -------------------------------
router.route('/unlink/facebook')
  .get(userController.unlinkFacebook);

// twitter --------------------------------
router.route('/unlink/twitter')
  .get(userController.unlinkTwitter);

// google ---------------------------------
router.route('/unlink/google')
  .get(userController.unlinkGoogle);

module.exports = router;

// Modify or set value for meeter in database
router.route('/updateMeeters')
  .post(userController.updateNumMeeter);

router.route('/updatePass')
  .post(userController.changePassword);

router.route('/retrieveMeeters')
  .get(userController.retrieveMeeters);

router.route('/cronTableDefy')
  .get(userController.cronTableDefy);

router.route('/saveMail')
  .post(userController.saveMail);