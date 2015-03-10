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
// DELETE ==============================
// =====================================
router.route('/delete')
  .get(userController.deleteAccount, function(req, res) {
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
    }
  )
  .post(
    passport.authenticate('local-signup', {
      successRedirect : '/users/profile', // redirect to the secure profile section
      failureRedirect : '/users/connect/local', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
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


module.exports = router;

// Modify or set value for meeter in database

router.route('/updatePass')
  .post(userController.changePassword);

router.route('/saveMail')
  .post(userController.saveMail);