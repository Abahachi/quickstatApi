var config = {
    mysql_localhost:{
        host:       'localhost',
        database:   'quickstat',
        user:       'gbuser',         //process.env.mysql_db_user
        password:   'root'        //process.env.mysql_db_pass
    },
    mysql_1gbru:{
        host:       'mysql92.1gb.ru',
        database:   'gb_tstcrawler',
        user:       'gb_tstcrawler',
        password:   '6zac85cfajk',
        insecureAuth: true
    }
};

module.exports = config;