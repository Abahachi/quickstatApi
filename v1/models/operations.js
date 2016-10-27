var bcrypt    = require('bcrypt-nodejs');
var knex      = require('knex')(config.mysql_localhost);
var bookshelf = require('bookshelf')(knex);

var Sites = bookshelf.Model.extend({
    tableName: 'sites'
});
var Persons = bookshelf.Model.extend({
    tableName: 'persons'
});
var Rank = bookshelf.Model.extend({
    tableName: 'personpagerank'
});
var Pages = bookshelf.Model.extend({
    tableName: 'pages'
});
var Users = bookshelf.Model.extend({
    tableName: 'users'
});

module.exports = {
        getSites: function (res){
            new Sites().fetchAll()
                .then(function (sites) {
                    res.status(200).json(sites);
                }).catch(function (error) {
                    console.log(error);
                    res.send('An error occured');
                });
        },
        getPersons: function (res){
             new Persons()
                 .fetchAll()
                 .then(function (persons) {
                     res.status(200).json(persons);
                 }).catch(function (error) {
                     console.log(error);
                     res.send('An error occured');
                 });
        },
        getPersonsByID: function(req, res){
             new Persons()
                 .where("ID", req.params.id)
                 .fetchAll()
                 .then(function (persons) {
                     res.status(200).json(persons);
                 }).catch(function (error) {
                     console.log(error);
                     res.status(200).json('An error occured');
                 });
        },
        getStats: function(res){
             new Rank()
                 .fetchAll()
                 .then(function (rank) {
                     res.status(200).json(rank);
                 })
                 .catch(function (error) {
                     console.log(error);
                     res.send('An error occured');
                 });
        },
        getStatsById: function(req, res){
            if (req.query.first_date && req.query.last_date) {
                new Pages()
                    .query(function (qb){
                        qb.where("FoundDate", '>=' , req.query.first_date)
                        .where("FoundDate",   '<=' , req.query.last_date)
                })
                    .fetchAll()
                    .then(function (stats) {
                        res.status(200).json(stats);
                    }).catch(function (error) {
                        console.log(error);
                        res.send('An error occured');
                    });
            } else {
                new Pages()
                    .where("ID", req.params.id)
                    .fetchAll()
                    .then(function (stats) {
                        res.status(200).json(stats);
                    })
                    .catch(function (error) {
                        console.log(error);
                        res.send('An error occured');
                    });
            }
        },
        getUser: function(req, username, password, done){
            new Users()
                .where("username", username)
                .fetch()
                .then(function (user) {
                    if(user && bcrypt.compareSync(password, user.get('password'))){
                        return done(null, user, req.flash('message', 'logged as ' + username));
                    }
                    return done(null,false, req.flash('failureMessage', 'Bad username or password'));
                }).catch(function (error) {
                    return done(error);
                });
        },
        addUser: function(req, username, password, done){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            new Users({
                "username": username,
                "password": hash
            }).save()
                .then(function(newRow) {
                    return done(null, true, req.flash('message', 'New user registred'));
                }).catch(function(err) {
                    return done(null, false, req.flash('failureMessage', 'User already exists'));
                });
        }
};