const passport = require('passport');
const CustomStrategy = require('passport-custom');
const https = require('https');

passport.use("cas",new CustomStrategy(
  function(req, done) {
  	if (!req.query.ticket)
  		return done(null,false, {message:"invalid pass"});
  	let serviceURL = req.protocol + '://' + req.get('host') + req.path ;
  	console.log(req.query.ticket);
  	console.log(`https://fed.princeton.edu/cas/validate?ticket=${req.query.ticket}&service=${serviceURL}`);
  	https.get(`https://fed.princeton.edu/cas/validate?ticket=${req.query.ticket}&service=${serviceURL}`,
  		(res,d)=>
  		{
  			let body = "";
  			res.setEncoding("utf8");
  			res.on('data',(d) => {body+=d})
  			res.on('end', ()=>{
  				let answer = body.split('\n');
  				console.log(answer)
  				if (answer[0] == 'no')
  					return done(null,false, {message:"invalid ticket"});
  				return done(null,{id:answer[1]});
  			})}
  		).on('error',console.log);


  	
  	// }      


  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    cb(null, {user:"narekDESERIAL",id:"haha"});
});

module.exports = {
	passport,
	authenticate:passport.authenticate("cas",{ failureRedirect: 'https://fed.princeton.edu/cas/login?service=http://localhost:3001/' }),
	logout:  function(req, res){
    req.logout();
    res.redirect('https://fed.princeton.edu/cas/logout?service=http://localhost:3001');
  }
}