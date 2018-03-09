var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');

var User = require('../models/user');

//  GET register an user
router.get('/register', function (req, res) {
    res.render('register', {
        title: 'Register'
    });
});

//  POST register an user
router.get('/register', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var confirm = req.body.confirm_password;

    req.checkBody('name', 'Name is required!!').notEmpty();
    req.checkBody('email', 'Email is required!!').notEmpty();
    req.checkBody('username', 'Username is required!!').notEmpty();
    req.checkBody('password', 'Password is required!!').notEmpty();
    req.checkBody('confirm_password', 'Password do not match!!').equals(password);

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);

        res.render('register', {
            errors: errors,
            title: 'Register'
        });
    } else {
        User.findOne({ username: username }, function (error, user) {
            if (error) {
                console.log(error);
            }

            if (user) {
                req.flash('danger', 'Username exists, choose another.');
                res.redirect('/user/register');
            } else {
                var user = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    admin: 0
                });

                bcrypt.genSalt(10, function (error, salt) {
                    bcrypt.hash(user.password, salt, function (error, hash) {
                        if (error)
                            console.log(error);

                        user.password = hash;
                        user.save(function (error) {
                            if (error) {
                                console.log(error);
                            } else {
                                req.flash('succes', 'You are now registered');
                                res.redirect('/user/login');
                            }
                        });
                    });
                });
            }
        });
    }

});

module.exports = router;
