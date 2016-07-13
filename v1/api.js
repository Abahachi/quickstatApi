var util = require('util');
var restify = require('restify');

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

            console.log('login:' + auth.basic.username);
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
    res.send(200, {result: "Sites_OK"});
});

rest.get('/v1/persons', function (req, res){

    //MySQL parsing
    res.send(200, {result: "Pers_OK"});
});


///v1/stats/1?site_id=1&first_date=01.08.2016&last_date=05.08.2016
rest.get('/v1/stats', function (req, res){

    //MySQL parsing
    if (req.query.first_date && req.query.last_date) {
        res.send(200, {result: "Sites_OK", first_date: req.query.first_date, last_date:req.query.last_date });
    }
    res.send(200, {result: "Sites_OK", body: req.query });
});

rest.get('/v1/stats/:id', function (req, res){

    //MySQL parsing
    if (req.query.first_date && req.query.last_date) {
        res.send(200, {result: "Sites_OK", id: req.params.id, first_date: req.query.first_date, last_date:req.query.last_date });
    }
    res.send(200, {result: "Sites_OK", body: req.query });
});


rest.listen(8080, function(){
    console.log('API launched');
});