var express     = require('express');
    app         = express();
    router      = express.Router();
    config      = require('./config.js');
    port        = process.env.PORT || 8082;
    bodyParser  = require('body-parser');
    cookieParser= require('cookie-parser');


var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
};
app.use(allowCrossDomain);
app.use(router);
app.use(cookieParser());

//parses json, x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

require('./controllers/routes')(app, express); //Adding routes


app.listen(port, function(){
    console.log('API launched');

});