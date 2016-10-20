module.exports = function (app, express) {
    var flash       = require('connect-flash');
        router      = express.Router();
        db = require('../models/operations.js')(app);

    var dbConfig = {
        client: 'mysql',
        connection: config.mysql_localhost
    };
    var knex = require('knex')(dbConfig);
    var bookshelf = require('bookshelf')(knex);

    app.use(flash());

    var passport = require('passport');
    var session = require('express-session');

    app.use(session({
        secret: 'coddedHere',
        saveUninitialized: true,
        resave: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done){
        done(null, user);
    });

    passport.deserializeUser(function(user, done){
        done(null, user);
    });


    var LocalStrategy = require('passport-local').Strategy;
    passport.use('local-login',new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
        function (req, username, password, done) {
            db.getUser(req, username, password, done)
          }
    ));

    passport.use('local-signup', new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done) {
            db.addUser(req, username, password, done);
        }));

    var authentication =  passport.authenticate('local-login',
        {
            successRedirect: '/logged',
            failureRedirect: '/login'
        });

    var regUser = passport.authenticate('local-signup',
        {
            successRedirect: '/registred',
            failureRedirect: '/register'
        });

    var mustBeAuthenticated = function (req, res, next){
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/login');

    };

    app.get('/v1/*', mustBeAuthenticated);
    app.post('/login', authentication);
    app.post('/register', regUser);

    app.get('/login',  function (req, res) {
        res.status(200).json('You have to login to get access!  ' + req.flash('failureMessage'));
    });

    app.get('/register', function (req, res) {
        res.status(200).json('Registeration page ' + req.flash('failureMessage') );
    });

    app.get('/logged', function (req, res) {
        res.status(200).json('You were logged as ' + req.flash('message'));
    });

    app.get('/registred', function (req, res) {
        res.status(200).json('Registred to get access' + req.flash('message'));
    });

    app.get('/logout', function (req, res) {
        console.log("logout");
        req.logout();
        res.redirect('/');
    });
};