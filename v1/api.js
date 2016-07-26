var util        = require('util');
var restify     = require('restify');
var mysql       = require('mysql');
var config      = require('./api/models/config.js')
var pool        = mysql.createPool(config.mysql_quickstat);//do not forget to update this on AUTH page
var operations  = require('./api/models/operations.js')(pool);


rest = restify.createServer({
    name: 'QuickStat'
});

var passport    = require('./api/models/auth.js');

rest.use(restify.authorizationParser()); //auto pars of log&pass
rest.use(restify.queryParser()); //get response parser
rest.use(restify.bodyParser()); //post parser
rest.use(restify.gzipResponse()); //auto zip

//rest.use(function(req, res, next) {
//    var auth = req.authorization;
//    if (req.path().indexOf('/' != -1)){  //check auth for all requests with 'v1'
//        console.log('login:'    + auth.basic.username);
//        console.log('password:' + auth.basic.password);
//        var auth = req.authorization;
//
//        if(auth.scheme == null){
//            res.header('WWW-Authenticate', 'Basic realm="Please login"');
//            return res.send(401);
//
//            console.log('login:'    + auth.basic.username);
//            console.log('password:' + auth.basic.password);
//            //check if right log+pass.
//            //Return if not
//            return next();
//        }
//    }
//
//    return next();
//});

rest.get('/', function (req, res){
    res.send(200, "OK");
    //console.log('login:'    + auth.basic.username);
    //console.log('password:' + auth.basic.password);
});




rest.get('/v1/sites', function (req, res){
    operations.listSites(function (err, response){
        if(err) {
            res.send(404, err);
        }
        res.send(200, response);
    });
});

rest.get('/v1/persons', function (req, res){
    operations.listPersons(function (err, response){
        if(err) {
            res.send(404, err);
        }
        res.send(200, response);
    });
});

rest.get('/v1/persons/:id', function (req, res){
    operations.listPersonsById(req.params.id, function (err,  response){
        if(err) {
            res.send(404, err);
        }
        res.send(200, response);
    });
});

rest.get('/v1/stats', function (req, res){
    if( req.query.site_id ){
        operations.listRanksBySiteId(req.query.site_id, function (err, response)
        {
            if (err) {
                res.send(404, err);
            }
            res.send(200,  response);
        });
    } else {
        operations.listRanks(function (err, response)
        {
            if (err) {
                res.send(404, err);
            }
            res.send(200, response);
        });

    }
});

rest.get('/v1/stats/:id', function (req, res){
    if (req.query.first_date && req.query.last_date)
    {
        operations.findPageStatFromTo(req.params.id, req.query.site_id, req.query.first_date, req.query.last_date,
            function (err, response) {
                if (err) {
                    res.send(404, err);
                }
                res.send(200, response);
            }
        );
    } else {
        operations.listRanksBySiteId(req.params.id, function (err, response)
        {
            if (err) {
                res.send(404, err);
            }
            res.send(200, response);
        });
    }
});



rest.listen(8081, function(){
    console.log('API launched');

});