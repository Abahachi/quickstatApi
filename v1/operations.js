var operations = function (pool) {
    return {
        listSites: function (callback) {
            pool.query('SELECT * FROM sites', callback);
        },
        listPersons: function (callback) {
            pool.query('SELECT * FROM persons', callback);
        },
        listPersonsById: function (PersonId, callback) {
            pool.query('SELECT * FROM persons WHERE ID = ?', PersonId, callback);
        },
        listRanks: function (callback) {
            pool.query('SELECT * FROM personPageRank ', callback);
        },
        // SELECT * FROM nomenclature INNER JOIN description using(id);
        listRanksBySiteId: function (pageId, callback) {
            pool.query('SELECT ID, Name, Rank FROM personPageRank, persons WHERE personPageRank.PersonID=persons.ID AND PageID=?', pageId, callback); //WHERE PageID = pageId   INNER JOIN persons
        },
        findPageStatFromTo: function (personId, siteId, fromTime, toTime, callback) { //not tested
            pool.query('SELECT * FROM pages WHERE SiteID = ? AND foundDate BETWEEN ? AND ?', [siteId, fromTime, toTime],  callback);
        }
    }
};

module.exports = operations;