module.exports = function (app, express) {

    var db = require('../models/operations.js')(app);

    require('../models/auth.js')(app, express);  //adding authorization

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
        db.getPersons(req,res);
    });

    app.get('/v1/persons/:id', function (req, res) {
        db.getPersonsByID(req, res);
    });

    app.get('/v1/stats', function (req, res) {
        db.getStats(req, res);
    });

    app.get('/v1/stats/:id', function (req, res) {
        db.getStatsById(req, res);
    });
};