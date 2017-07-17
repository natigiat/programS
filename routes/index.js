var express = require('express');
var router = express.Router();


var async = require('async');
var Program = require('../modules/program.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  var results;
  results = {};

  async.parallel({
      ProgramsAll: function(callback) {
        return Program.find({}).limit(12).exec(function(err, result) { 
         return callback(err, result);
        });
      },


    }, function(err, results) {
      // return res.json(results.promotions);
      var ProgramsAll = results.ProgramsAll;

      res.render('index', { title: 'Express' ,ProgramsAll:ProgramsAll});
  });
  
});

module.exports = router;

