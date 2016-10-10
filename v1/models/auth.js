//var flash       = require('connect-flash');
//var passwordHash= require('password-hash');
//var randtoken   = require('rand-token');
//
//var mysql       = require('mysql');
//var config      = require('../../config.js');
//var pool        = mysql.createPool(config.mysql_localhost);
//
//
//var crypto = require('crypto'),
//    algorithm = 'aes-256-ctr',
//    cryptoPassword = 'd6F3EfeqASDfsdfsfsdASDAsDasdasdasd';
//
//
//function encrypt(text){
//    var cipher = crypto.createCipher(algorithm,cryptoPassword);
//    var crypted = cipher.update(text,'utf8','hex');
//    crypted += cipher.final('hex');
//    return crypted;
//}
//
//function decrypt(text){
//    var decipher = crypto.createDecipher(algorithm,cryptoPassword);
//    var dec = decipher.update(text,'hex','utf8');
//    dec += decipher.final('utf8');
//    return dec;
//}
//
//var auth ;
//
//var operations  = require( './operations.js')(pool);
//
//var cookieParser = require('cookie-parser');
//app.use(cookieParser());
//
//// parses json, x-www-form-urlencoded, and multipart/form-data
//var bodyParser = require('body-parser');
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({
//    extended: true
//}));
//
//var passport = require('passport-restify');
//app.use(passport.initialize());
//app.use(passport.session());
//
//app.use(flash());
//
//var session = require('cookie-session');
//app.use(session({keys: ['braincoding'], maxAge: 500}));
//
//passport.serializeUser(function(user, done){
//    done(null, user.username);
//});
//
//passport.deserializeUser(function(id, done){
//    done(null, {username: id});
//});
//var LocalStrategy = require('passport-local').Strategy;
//passport.use(new LocalStrategy(
//    function (username, password, done) {
//        operations.getUser(username, function(err, res){
//            if(err){
//                return done(null, false, {data: err});
//            } else {
//                var encryptPassword = res[0].password;
//                if( decrypt(encryptPassword) == password){
//                    return done(null, {username: username});
//                } else {
//                    return done(null, false, {err: "failed"});
//                }
//            }
//        });
//
//     }
//));
//
//passport.use('local-signup', new LocalStrategy({
//        // by default, local strategy uses username and password, we will override with email
//        usernameField : 'username',
//        passwordField : 'password',
//        passReqToCallback : true // allows us to pass back the entire request to the callback
//    },
//    function(req, username, password, done) {
//        var encryptPassword = encrypt(password);
//        var token = randtoken.generate(16);
//        operations.addUser(username, encryptPassword, token, "0", function(err, res){
//            if(err){
//                console.log(err);
//                return done(null, false, {data: err});
//            } else {
//                return done(null, {username: username});
//            }
//
//        });
//    }));
//
//var authentication =  passport.authenticate('local',
//    {
//        successRedirect: '/logged',
//        failureRedirect: '/login',
//        failureMessage: "Invalid username or password"
//    });
//var regUser = passport.authenticate('local-signup', {
//        successRedirect: '/registred',
//        failureRedirect: '/register',
//        failureFlash : true
//});
//
//var mustBeAuthenticated = function (req, res, next){
//    req.isAuthenticated()? next() : res.redirect('/login');
//};
//
//app.get('/', authentication);
//
//app.post('/login', authentication);
//app.post('/register', regUser);
//
////TEST
//app.get('/user', function(req, res){
//    res.send(200, 'Hello');// + req.user.username);
//});
//
//app.get('/login', function(req, res){
//    res.send(200, 'Please, login');
//});
//app.get('/register', function(req, res){
//    res.send(200, 'Registeration page');
//});
//
//
//app.get('/logged', function(req, res){
//    res.send(200, 'You were logged as ');
//});
//app.get('/registred', function(req, res){
//    res.send(200, 'Registred to get access');
//});
//
//app.get('/logout', function(req, res){
//    console.log("logout");
//    req.logout();
//    res.redirect('/');
//});
//
//module.exports = auth;