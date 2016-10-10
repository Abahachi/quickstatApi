module.exports = function (app, express) {
    bodyParser = require('body-parser');
    //mysql = require('mysql');
    Promise = require('bluebird');


    var dbConfig = {
        client: 'mysql',
        connection: config.mysql_localhost
    };

    var knex = require('knex')(dbConfig);
    var bookshelf = require('bookshelf')(knex);

    app.set('bookshelf', bookshelf);
    var allowCrossDomain = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        next();
    };

    app.use(allowCrossDomain);

    app.use(bodyParser.urlencoded({extended: true}));

    app.use(bodyParser.json());

    app.use(bodyParser.json({type: 'application/vnd.api+json'}));

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

    app.get('/v1/sites', function (req, res) {
        new Sites().fetchAll()
            .then(function (sites) {
                res.send(sites.toJSON());
            }).catch(function (error) {
                console.log(error);
                res.send('An error occured');
            });
    });

    app.get('/v1/persons', function (req, res) {
        new Persons().fetchAll()
            .then(function (persons) {
                res.send(persons.toJSON());
            }).catch(function (error) {
                console.log(error);
                res.send('An error occured');
            });
    });


    app.get('/v1/persons/:id', function (req, res) {
        Persons().forge()
            .where("ID", req.params.id)
            .fetchAll()
            .then(function (persons) {
                res.send(persons.toJSON());
            }).catch(function (error) {
                console.log(error);
                res.send('An error occured');
            });
    });

    app.get('/v1/stats', function (req, res) {
        Rank.forge()
            .fetchAll()
            .then(function (rank) {
                res.send(rank.toJSON());
            })
            .catch(function (error) {
                console.log(error);
                res.send('An error occured');
            });
    });

    app.get('/v1/stats/:id', function (req, res) {
        if (req.query.first_date && req.query.last_date) {
            Pages.forge()
                .where("FoundDate", '>=' , req.query.first_date)
                .where("FoundDate", '<=' , req.query.last_date)
                .fetchAll()
                .then(function (stats) {
                    //persons.whereBetween()
                    res.send(stats.toJSON());
                }).catch(function (error) {
                    console.log(error);
                    res.send('An error occured');
                });
        } else {
            Pages.forge()
                .fetchAll()
                .then(function (stats) {
                    res.send(stats.toJSON());
                })
                .catch(function (error) {
                    console.log(error);
                    res.send('An error occured');
                });
        }
    });

    app.get('*', function(req, res){
        res.status(404).send('[{Page is not found}]');
    });

};