var express = require('express');
var router = express.Router();
var path = require('path');
var multer  = require('multer');
var bcrypt  = require('bcrypt-nodejs');
var sendgrid  = require('sendgrid')('nati','nati1234');
var fs = require('fs');
var ip = require('ip');

//grab data
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
var validator = require('validator');


//facsebook image




//define root dir
global.appRoot = path.dirname(module.parent.filename); 

var User = require('../modules/user.js');


router.post('/register', function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {  
    if (err) { return next(err); }
    if (!user) {   
      console.log("hereeeee");
      return res.redirect('/'); 
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
        console.log("hereeeeee222");
        return res.redirect('/'); 
    });
  })(req, res, next);

});



//config serialize and deserialze
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {  
    
    User.findById(id, function(err, user) {
      done(err, user);
    });
});





 passport.use('local-signup', new LocalStrategy({
    
    passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username , password , done) {
        console.log(username);
        var profileimg = req.body.profileimg;
        var userIp = ip.address();
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        var name = req.body.name;

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.getUserByEmail(username , function(err, user) {
            // if there are any errors, return the error
            

            if (err)
                return done("error "  + err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, ('That email is already taken.'));
            } else if (!validator.isEmail(username)) {
                return done(null, false, ('Not A Valid Email'));
            }else{

                // if there is no user with that email
                // create the user
                var newUser = new User ({
                  name: name , 
                  ip:userIp,
                  email: username,
                  profileimg:profileimg,
                  password:bcrypt.hashSync(password)
                });

                // save the user
                newUser.save(function(err) {
                    if (err){
                     throw err; 
                   }else{
                       
                      return done(null, newUser);               
                      
                   }
 
                });
            }

        });    

        });

    }));



// Use the LocalStrategy within Passport to login/”signin” users.
passport.use(new LocalStrategy(

  function(username , password , done) {
    User.getUserByEmail(username , function(err , user){
      if (err) { return done(err); }
      if(!user){
       
        return done(null, false);
      }

      User.comparePassword(password , user.password  , function (err , isMatch){
        if(err) throw err;
        if(isMatch){
        	console.log("match user");
          return done(null , user);
        }else{
          console.log('invalid password');
          return done(null , false , {message: "invalid password"});
        }
      })
    });
  }
));




router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
      // req.flash('error' , 'Invalid User Details' ); 
      return req.res.redirect('/'); 
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log(err);
      return req.res.redirect('/'); 
    });
  })(req, res, next);
});



router.get('/logout' ,  function(req, res ) {
  req.logout();
  // req.flash('success' , 'You Have Logged Out' ); 
  req.res.redirect('/');
});



/******* manage facebook logIn
****************************************************/

passport.use(new FacebookStrategy({
    clientID: "130848877508432",
    clientSecret: "676e31dc2dec16bce7aa41150e734a79",
    callbackURL: "http://localhost:3000/users/auth/facebook/callback",
    profileFields: ['id','photos', 'emails']
  },
  function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        var userIp = ip.address();
        User.findOne({
            'email': profile.emails[0].value
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    profileimg: profile.photos[0].value,
                    username: profile.displayName,
                    provider: 'facebook',
                    facebookId:profile.id,
                    ip:userIp
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                //found user. Retur
                User.updateOne({email: profile.emails[0].value}, {facebookId: profile.id ,  profileimg: profile.photos[0].value}).exec(function(err, result) {
                  if (err) throw err;
    			  console.log("1 record updated");

                });

                return done(err, user);
            }
        });
  }
));

router.get('/auth/facebook', passport.authenticate('facebook' , { scope: ['email', 'user_about_me','user_managed_groups'] }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));




module.exports = router;