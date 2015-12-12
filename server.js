/*
 * Food App Server 
 */
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// assets
app.use(express.static(__dirname + '/public'));

// to process post requests
app.use(bodyParser.json());

// load input test-data
var data = require('./data.js');
var pizzaList = data.pizzaList;
var drinkList = data.drinkListByType;
//console.log(pizzaList); console.log("\n\n"); console.log(drinkList);

// main, viewed at http://localhost:8080
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// app routes
app.get('/pizzas/', function (req, res) {

    // adding some more pizzas
    var localList = pizzaList.slice(0);
    for (var i = 0; i < 30; i++) {
        localList.push({
            name: "Generic Pizza" + (i + 1),
            price: 30 + i,
            details: "Lorem ipsum " + (i + 1),
            img: "img/pizza.jpg"
        });
    }

    res.json(localList);
});

app.get('/drinks/', function (req, res) {
    res.json(drinkList);
});

// submit process
app.post('/submit', function (req, res) {

    // simply show order data; we can save them in DB, send via API to 
    // our pizzeria or whatever we need
    console.log("New order:\n");
    console.log(req.body);

    res.json({msg: 'Success'});
});

app.listen(8080);
