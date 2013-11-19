var mongoose = require('mongoose'),
    passport = require('passport'),
    _ = require('underscore');

// Import models
var User = require('../models/User');

exports.account = function(req, res) {
  res.render('account', { user: req.user });
};

/**
 * GET /login
 */
exports.getLogin = function(req, res) {
  res.render('login', {
    title: 'Login',
    user: req.user,
    messages: req.flash('messages')
  });
};

/**
 * POST /login
 */
exports.postLogin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (!user) {
      req.flash('messages', info.message);
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
};

/**
 * GET /signup
 */
exports.getSignup = function(req, res) {
  res.render('signup', {
    title: 'Create Account',
    user: req.user,
    messages: req.flash('messages')
  });
};

/**
 * POST /signup
 */
exports.postSignup = function(req, res) {
  var user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  });

  user.save(function(err) {
    if (err) {
      console.log(err);
      if (err.code === 11000) {
        req.flash('messages', 'User already exists');
        return res.redirect('/signup');
      } else if (err.name === 'ValidationError') {
        req.flash('messages', _.pluck(_.toArray(err.errors), 'message'));
        return res.redirect('/signup');
      }
    }
    req.logIn(user, function(err) {
      if (err) throw err;
      res.redirect('/');
    });
  });
};

/**
 * GET /admin
 */
exports.admin = function(req, res) {
  res.send('access granted admin!');
};

/**
 * GET /logout
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};