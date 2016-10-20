module.exports = function(app){
    var dbConfig = {
        client: 'mysql',
        connection: config.mysql_localhost
    };
    var bcrypt    = require('bcrypt-nodejs');
    var knex      = require('knex')(dbConfig);
    var bookshelf = require('bookshelf')(knex);

    app.set('bookshelf', bookshelf);

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

    return {
        getPersons: function (req, res){
             new Persons()
                .fetchAll()
                .then(function (persons) {
                    res.send(persons.toJSON());
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
                    res.send(persons.toJSON());
                }).catch(function (error) {
                    console.log(error);
                    res.send('An error occured');
                });
        },
        getStats: function(req, res){
             new Rank()
                .fetchAll()
                .then(function (rank) {
                    res.send(rank.toJSON());
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
                        .orWhere("FoundDate", '<=' , req.query.last_date)
                })
                    .fetchAll()
                    .then(function (stats) {
                        //persons.whereBetween()
                        res.send(stats.toJSON());
                    }).catch(function (error) {
                        console.log(error);
                        res.send('An error occured');
                    });
            } else {
                new Pages()
                    .where("ID", req.params.id)
                    .fetchAll()
                    .then(function (stats) {
                        res.send(stats.toJSON());
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
                        //user = user
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
    }
};