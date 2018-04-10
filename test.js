const express = require('express');
const app = express();
const Auth = require('./Auth.js');
const expressSession = require('express-session');
const bodyParser = require("body-parser");

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(expressSession({ secret: "cats", resave:true, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(Auth.passport.initialize());
app.use(Auth.passport.session());

// app.use(passport.session());
// Define routes.
app.get('/',
   Auth.authenticate,
  function(req, res) {
    res.send("secret");
  });

app.get('/login',
  function(req, res){
    res.send('login');
  });
  
app.get('/login1',
	Auth.authenticate,
	function(req, res) {
    res.send('secret');
  });
  
app.get('/logout',Auth.logout);

app.listen(3001);
