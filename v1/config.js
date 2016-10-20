var config = {
    mysql_localhost:{
        host:       'localhost',
        database:   'quickstat',
        user:       'gbuser',         //process.env.mysql_db_user
        password:   'root'        //process.env.mysql_db_pass
    },
    mysql_quickstat:{
        host:       'quickstat.cf',
        database:   'quickstat',
        user:       'gb_tstcrawler',
        password:   '6zac85cfajk',
        debug:      true
    }
};

module.exports = config;