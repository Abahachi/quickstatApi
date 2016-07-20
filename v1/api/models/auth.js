var operations  = require( './operations.js');
var flash       = require('connect-flash');
var siteUrl = '/v1/';
var auth = function (restifyServer) {
   var rest = restifyServer;
};


var cookieParser = require('cookie-parser');
rest.use(cookieParser());

// parses json, x-www-form-urlencoded, and multipart/form-data
var bodyParser = require('body-parser');
rest.use(bodyParser.json());
rest.use(bodyParser.urlencoded({
    extended: true
}));

var passport = require('passport-restify');
rest.use(passport.initialize());
rest.use(passport.session());

rest.use(flash());

var session = require('cookie-session');
rest.use(session({keys: ['braincoding'], maxAge: 500}));

var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function (username, password, done) {
           if (username != 'admin')
             return done(null, false, {message: 'Bad login'});
           if (password != 'admin')
             return done(null, false, {message: 'Bad password'});
           return done(null, {username: 'admin'});
        return done(null, {username: 'admin'});
       //operations.findUser(username, function(err, res){
       //   console.log("user = " + res);
       //   if (username != 'admin')
       //     return done(null, false, {message: 'Bad login'});
       //   if (password != 'admin')
       //     return done(null, false, {message: 'Bad password'});
       //   return done(null, {username: 'admin'});
       //});
     }
));

passport.serializeUser(function(user, done){
    done(null, user.username);
});

passport.deserializeUser(function(id, done){
   done(null, {username: id});
});

var authentication =  passport.authenticate('local',
    {
        successRedirect: '/v1/stats',
        failureRedirect: '/v1/persons',
        failureMessage: "Invalid username or password"
    });

var mustBeAuthenticated = function (req, res, next){
    req.isAuthenticated()? next() : res.redirect('/login');
};

rest.get('/', authentication);

rest.post('/login', authentication);

//TEST
rest.get('/user', function(req, res){
    res.send(200, 'Hello');// + req.user.username);
});

rest.get('/logout', function(req, res){
    console.log("logout");
    req.logout();
    res.redirect('/');
});

module.exports = auth;