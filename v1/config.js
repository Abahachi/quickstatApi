var config = {
    mysql_localhost:{
        client : 'mysql',
        connection: {
            host:       'localhost',
            database:   'quickstat',
            user:       'gbuser',         //process.env.mysql_db_user
            password:   'root'        //process.env.mysql_db_pass
        }
    }
};

module.exports = config;
