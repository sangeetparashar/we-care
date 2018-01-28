var express = require('express');
var app = express();
var path = require('path');
var engines = require('consolidate');
var bodyParser = require('body-parser');
var assert = require('assert');
const { ObjectID } = require('mongodb');
const { mongoose } = require('./db/app');
const { login } = require('./models/login');
const { food } = require('./models/food');
const MongoClient = require('mongodb').MongoClient;


var db;

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template.html', { error: err });
}

// viewed at http://localhost:8080
app.use(express.static(path.join(__dirname, '/public')));
app.engine('html', engines.ejs);
app.set('view engine', 'html');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

MongoClient.connect('mongodb://admin:admin@ds117888.mlab.com:17888/deltahacksdata', function(err, database) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");
    const db = database.db('deltahacksdata');

    // GET method route
    app.get('/organizations', function (req, res) {
        db.collection('logins').find({claimed: {$exists: true}}).toArray(
            function(err, foodPosts) {
                res.render('organizations.html', {'foodPosts': foodPosts});
            }
        )
    });
    // GET method route
    app.get('/shelters', function (req, res) {
        db.collection('logins').find({claimed: {$exists: true}}).toArray(
            function(err, foodPosts) {
                res.render('shelters.html', {'foodPosts': foodPosts, 'Shelter': 'Angels'});
            }
        )
    });

    // POST method route
    app.post('/add_foods', function(req, res, next) {
        var title = req.body.title;
        var poster = req.body.organization;
        var expirytime = req.body.expiry;
        var timesinceposting = req.body.time;
        
       if ((title == '') || (poster == '') || (expirytime == '') || (timesinceposting == '')) {
            next('Please provide an entry for all fields.');
        } else {
            db.collection('logins').insertOne(
                { 'title': title, 'poster': poster, 'expirytime': expirytime, 'timesinceposting': timesinceposting, claimed: false },
                function (err, r) {
                    assert.equal(null, err);
                    db.collection('logins').find({claimed: {$exists: true}}).toArray(
                        function(err, foodPosts) {
                            res.render('organizations.html', {'foodPosts': foodPosts});
                        }
                    )
                }
            );
        }
    });

    // claim button function
    app.post('/claim_food', function(req, res, next) {
        var id = req.body._id;
        db.collection('logins').updateOne(
            {_id: new ObjectID(id)},{$set: { claimed: true }},
            function (err, r) {
                assert.equal(null, err);
                db.collection('logins').find({claimed: {$exists: true}}).toArray(
                    function(err, foodPosts) {
                        res.render('shelters.html', {'foodPosts': foodPosts, 'Shelter': 'Angels'});
                    }
                )
            }
        );
    });

    app.use(errorHandler);

  app.listen(8080, () => {
    console.log( 'listening on localhost:8080');
    });
});

let newlogin = new login ({
    name: "Loblaws",
	location: "Toronto",
	identity: 'organization',
	ratings: 5
});

app.get('/', function(req, res) {
    // newlogin.save(function (err) {
    //     if(err)
    //         throw err;
    //     console.log("i think i saved a new document");
    //     });
    res.render('wow.html');        
});

var foodPosts = [
  {
    title: '10 cans',
    poster: 'Loblaws',
    distance: '0.7km',
    expiry_date: '3wks',
    restriction: 'contains nuts dummy'
  }, 
  {
    title: '20 cans',
    poster: 'No Frills',
    distance: '1.7km',
    expiry_date: '2wks',
    restriction: 'contains nuts dummy'
  }
];


app.get('/contribute', function (req, res) {
  res.render('contribute.html');
});

app.get('/fooddonor', function (req,res) {
    res.send('GET request for the food donor page');
});

app.get('/postfood', function (req,res) {
    res.send('GET request for the post food page');
});

app.get('/organization', function (req,res) {
    res.send('GET request for the charitable organization page');
});

app.get('/claimedfood', function (req,res) {
    res.send('GET request for the claimed food page');
});

app.get('/submit', function (req,res){
    res.redirect('http://privatenostorage.herokuapp.com');
});



