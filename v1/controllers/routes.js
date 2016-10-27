module.exports = function (app, express) {
    var db = require('../models/operations.js');

    require('../models/auth.js')(app, express);  //adding authorization

    app.get('/v1/sites', function (req, res) {
        db.getSites(res);
    });

    app.get('/v1/persons', function (req, res) {
        db.getPersons(res);
    });

    app.get('/v1/persons/:id', function (req, res) {
        db.getPersonsByID(req, res);
    });

    app.get('/v1/stats', function (req, res) {
        db.getStats(res);
    });

    app.get('/v1/stats/:id', function (req, res) {
        db.getStatsById(req, res);
    });
};