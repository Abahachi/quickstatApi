var util        = require('util');
var restify     = require('restify');
var mysql       = require('mysql');
var config      = require('./config.js')
var pool        = mysql.createPool(config.mysql);
var operations  = require('./operations.js')(pool);

rest = restify.createServer({
    name: 'QuickStat'
});

rest.use(restify.authorizationParser()); //auto pars of log&pass
rest.use(restify.queryParser()); //get response parser
rest.use(restify.bodyParser()); //post parser
rest.use(restify.gzipResponse()); //auto zip

rest.use(function(req, res, next) {
    if (req.path().indexOf('/protected' != -1)){  //check auth for all requests with 'v1'
        var auth = req.authorization;

        if(auth.scheme == null){
            res.header('WWW-Authenticate', 'Basic realm="Please login"');
            return res.send(401);

            console.log('login:'    + auth.basic.username);
            console.log('password:' + auth.basic.password);
            //check if right log+pass.
            //Return if not
            return next();
        }
    }

    return next();
});

rest.get('/', function (req, res){
    res.send(200, {result: "OK"});
});

rest.get('/v1/sites', function (req, res){

    //MySQL parsing
    operations.listSites(function (err, response){
        if(err) {
            res.send(404, {result: "Sites not found"});
        }
        res.send(200, {result: response});
    });
});

rest.get('/v1/persons', function (req, res){
    operations.listPersons(function (err, response){
        if(err) {
            res.send(404, {result: "Persons not found"});
        }
        res.send(200, {result: response});
    });
});

/*
 1. Запросить общую статистику для всех персон по сайту:
 /v1/stats?site_id=1

 [
 {"id":1, "name":"Путин", "rank":23},
 {"id":2, "name":"Медведев", "rank":18},
 {"id":3, "name":"Навальный", "rank":10}
 ]
*/
rest.get('/v1/stats', function (req, res){
    operations.listRanksBySiteId(req.query.site_id, function (err, response)
    {
        if (err) {
            res.send(404, {result: "Ranks not found"});
        }
        res.send(200, {result: response});
    });
});

rest.get('/v1/stats/:id', function (req, res){
    if (req.query.first_date && req.query.last_date)
    {
        operations.findPageStatFromTo(req.params.id, req.query.site_id, req.query.first_date, req.query.last_date,
            function (err, response) {
                if (err) {
                    res.send(404, {result: "Ranks not found"});
                }
                res.send(200, {result: response});
            }
        );
    } else {
        res.send(404, {result: "problem occured"});
    }
});



rest.listen(8080, function(){
    console.log('API launched');
});