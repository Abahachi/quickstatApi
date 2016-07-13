var operations = function(pool){
    return {
        listSites: function (callback){
            pool.query('SELECT * FROM sites', callback);
        },
        listPersons: function (callback){
            pool.query('SELECT * FROM persons', callback);
        },
        listRanksBySiteId: function (pageId, callback){
            pool.query('SELECT * FROM personPageRank WHERE PageID="pageId"', callback);
        },
        findPageStatFromTo: function(personId, siteId, fromTime, toTime, callback ){
            pool.query('SELECT * FROM pages WHERE SiteID="siteId" AND (foundDate BETWEEN fromTime AND toTime)', callback);
        }

    }
}

module.exports = operations;