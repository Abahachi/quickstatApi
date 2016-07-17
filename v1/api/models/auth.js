var operations = require( './operations.js');
var siteUrl = '/v1/';
var auth = function (restifyServer) {
   var rest = restifyServer;
};


//// parses json, x-www-form-urlencoded, and multipart/form-data
//var bodyParser = require('body-parser');
//rest.use(bodyParser());

var passport = require('passport');
rest.use(passport.initialize());
rest.use(passport.session());

var cookieParser = require('cookie-parser');
rest.use(cookieParser());
var session = require('cookie-session');
rest.use(session({keys: ['braincoding'], maxAge: 500}));

var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function (username, password, done) {
       operations.findUser(username, function(err, res){
          console.log("user = " + res);
          if (username != 'admin')
            return done(null, false, {message: 'Bad login'});
          if (password != 'admin')
            return done(null, false, {message: 'Bad password'});
          return done(null, {username: username});
       });
     }
));

passport.serializeUser(function(user, done){
    done(null, user.username);
});

passport.deserializeUser(function(id, done){
   done(null, {username: id});
});

var authentication = passport.authenticate(
    'local', {
        successRedirect: '/stat',
        failureRedirect: '/login'
    }
);

var mustBeAuthenticated = function (req, res, next){
    req.isAuthenticated()? next() : res.redirect('/');
};

//rest.all(siteUrl, mustBeAuthenticated);
//rest.all('/user')

rest.get('/login', function(req, res){
   res.send(200, 'LoginForm');
});

rest.post('/login', authentication);

//rest.get('/', authenticate);

//TEST
rest.get('/user', function(req, res){
    res.send(200, 'Hello');// + req.user.username);
});

rest.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = auth;