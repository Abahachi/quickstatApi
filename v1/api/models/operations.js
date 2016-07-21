var sqlServer = "localhost";
if(sqlServer == "1gb.ru"){
    var _sites          = "test2_sites";
    var _siteId         = "site_id"; //SiteID
    var _persons        = "test_persons";
    var _personId       = "Person_id"; //PersonID
    var _pages          = "test2_pages";
    var _pageId         = "page_id"; //
    var _personPageRank = "test_person_page_rank";
    var _foundDate      = "added"; //FoundDate
}
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
        listSites: function (callback) {
            //console.log("listSites");
            pool.query('SELECT * FROM ' + _sites, callback);
        },
        listPersons: function (callback) {
            //console.log("listPersons");
            pool.query('SELECT * FROM ' + _persons, callback);
        },
        listPersonsById: function (PersonId, callback) {
            //console.log("listPersonsById");
            pool.query('SELECT * FROM' + _persons + ' WHERE ID = ?', PersonId, callback);
        },
        listRanks: function (callback) {
            //console.log("listRanks");
            pool.query('SELECT * FROM ' + _personPageRank, callback);
        },
        listRanksBySiteId: function (pageId, callback) {
            //console.log("listRanksBySiteId");
            pool.query('SELECT * FROM ' + _personPageRank + ',' + _persons + ' WHERE ' + _personPageRank + '.' + _personId + ' = ' + _persons + '.ID AND ' + _pageId + ' = ?', pageId, callback); //ID, Name, Rank
        },
        findPageStatFromTo: function (personId, siteId, fromTime, toTime, callback) {
            //console.log("findPageStatFromTo");
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