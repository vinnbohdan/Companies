var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var functions = require('./functions');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var urlconnection = config.urlconnection;

//Company schema & model
var companySchema = new Schema({
  name: {
      type: String,
      required: true,
      minlength:1,
      maxlength:50
  },
  earnings: {
      type: Number,
      required: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    required: false
  },
  parentName: {
    type: String,
    required: false
  }
}, { versionKey: false });
var Company = mongoose.model("Company", companySchema);

//GET home page
router.get('/', function(req, res, next) {
  res.render('index');
});

// GET json data for jsTree
router.get('/data.json', function(req, res, next) {
  mongoose.connect(urlconnection);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    Company.find({},{_id:1, name: 1, parentId: 1, earnings: 1, parentName: 1}).lean().exec(function (err, docs) {
      mongoose.disconnect();
      if(err) return console.log(err);
      var treeArray = [];
      
      if (docs === undefined || docs.length == 0) {
        treeArray = [];
      } else {
        // convert data from mongoDB to jsTree json using function from module
        treeArray = functions.convert(docs);
        // modify nodes names with earnings using function from module
        functions.totalEarnings(treeArray, 0);
      }
      res.json(JSON.stringify(treeArray.children));
    });
  });
});

//POST create company record in MongoDB
router.post('/insert', function(req, res, next) {
  mongoose.connect(urlconnection);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    var parID = null;
    var parName = "";
    Company.find({name: req.body.tbNameComp.toLowerCase()},{_id: 0, name: 1}).lean().exec(function (err, docs) {
      if(err) return console.log(err);
      if (docs === undefined || docs.length == 0) { // Company does not exist
        Company.find({name: req.body.tbParentName.toLowerCase()},{_id: 1}).lean().exec(function (err, obj) {
          if(err) {
            return console.log(err);
          } else {
            if (obj === undefined || obj.length == 0) {// Parent does not exist
              parID = null;
              parName = "";
            } else {                                   // Parent exists
              parID = obj[0]._id;
              parName = req.body.tbParentName.toLowerCase();
            }
            Company.create({name: req.body.tbNameComp.toLowerCase(), earnings: req.body.tbEarnings, parentId: parID, parentName: parName}, function(err, doc){
              mongoose.disconnect();
              if(err) {
                return console.log(err);
              } else {
                res.status(200).send("Company " + doc.name + " was saved successfully");
              } 
            });
          }
        });
      } else {                                      // Company exists
        if (docs[0].hasOwnProperty("name")) {
          res.status(200).send("Company " + docs[0].name + " already exists");
        }      
      }
    });
  });
});  

//POST update company record in MongoDB
router.post('/update', function(req, res, next) {
  mongoose.connect(urlconnection);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    var parID = null;
    var parName = "";
    Company.find({_id: req.body.idComp, name: req.body.tbNameComp.toLowerCase()},{_id: 0, name: 1}).lean().exec(function (err1, docs) {
      if(err1) {
        return console.log(err1);
      } else {
        Company.find({name: req.body.tbParentName.toLowerCase()},{_id: 1}).lean().exec(function (err, obj) {
          if(err) return console.log(err);
          if (obj === undefined || obj.length == 0) {// Parent does not exist
            parID = null;
            parName = "";
          } else {                                   // Parent exists
            parID = obj[0]._id;
            parName = req.body.tbParentName.toLowerCase();
          }
          Company.replaceOne({_id: req.body.idComp}, {name: req.body.tbNameComp.toLowerCase(), earnings: req.body.tbEarnings, parentId: parID, parentName: parName}, function(err, doc){
            if(err) {
              return console.log(err);
            } else {
              if (docs === undefined || docs.length == 0) { // Company does not exist
                Company.updateMany({parentId: req.body.idComp}, {$set: {parentName: req.body.tbNameComp}}, function (err4, obj) {
                  mongoose.disconnect();
                  if(err4) {
                    return console.log(err4);
                  } else {
                    res.sendStatus(200);
                  }
                });
              } else {                                      // Company exists     
                res.sendStatus(200);
              };
            };
          });
        });
      };
    });
  });
}); 

//POST delete company record in MongoDB
router.post('/delete', function(req, res, next) {
  mongoose.connect(urlconnection);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    Company.deleteOne({_id: req.body.idComp}, function (err) {
      mongoose.disconnect();
      if(err) {
        return console.log(err);
      } else {
        res.sendStatus(200);
      } 
    });
  });
}); 
module.exports = router;