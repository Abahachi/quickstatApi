var express     = require('express');
    app         = express();
    config      = require('./config.js');
    router      = require('./controllers/routes.js')(app, express);


app.listen(8082, function(){
    console.log('API launched');

});