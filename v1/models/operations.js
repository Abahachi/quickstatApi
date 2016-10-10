var sqlServer = "localhost";

if(sqlServer == "localhost"){
    var _sites          = "sites";
    var _siteId         = "SiteID";
    var _persons        = "persons";
    var _personId       = "PersonID";
    var _pages          = "pages";
    var _pageId         = "pageID";
    var _personPageRank = "personPageRank";
    var _foundDate      = "FoundDate";
  }
if(sqlServer == "quickstat"){
    var _sites          = "sites";
    var _siteId         = "site_id";
    var _foundDate      = "found_date_time";
    var _persons        = "persons";
    var _personId       = "user_id";
    var _personName     = "name";
    var _pages          = "pages";
    var _pageId         = "page_id";
    var _personPageRank = "person_page_rank";

}


var operations = function (pool) {
    return {
        getSites: function (callback) {
            pool.query('SELECT * FROM ' + _sites, callback);
        },
        getPersons: function (callback) {
            pool.query('SELECT * FROM ' + _persons, callback);
        },
        getPersonsById: function (PersonId, callback) {
            pool.query('SELECT * FROM' + _persons + ' WHERE ID = ?', PersonId, callback);
        },

        getRanks: function (callback) {
            pool.query('SELECT * FROM ' + _personPageRank, callback);
        },
        getRanksBySiteId: function (pageId, callback) {
            pool.query('SELECT * FROM ' + _personPageRank + ',' + _persons + ' WHERE ' + _personPageRank + '.' + _personId + ' = ' + _persons + '.ID AND ' + _pageId + ' = ?', pageId, callback); //ID, Name, Rank
        },
        findPageStatFromTo: function (personId, siteId, fromTime, toTime, callback) {
            pool.query('SELECT ' + _foundDate + ', ' + _siteId + ' FROM ' + _pages + ' WHERE ' + _siteId + ' = ? AND ' + _foundDate + ' BETWEEN ? AND ?', [siteId, fromTime, toTime],  callback);
        },


        findUser: function (username, callback){
            pool.query('SELECT username,password FROM users WHERE users.username=?' , username, callback);
        },

        addUser: function(username, password, token, privileges, callback){
            pool.query('INSERT INTO users (username, password, token, privileges) VALUES ("' + username + '", "' + password + '", "' + token + '", "' + privileges + '")', callback) ;
        }
    }
};

module.exports = operations;