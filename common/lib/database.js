var mysql = require('promise-mysql');
var uuid = require('node-uuid');
var Site = require('./site');

var options = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sites',
  multipleStatements: true
};

var pool = mysql.createPool(options);

function createSite(name, url, cb) {
  var query = '\
START TRANSACTION; \
INSERT INTO sites (id, name, url, check_interval, created_date, is_active, is_deleted) \
VALUES (?, ?, ?, ?, ?, ?, ?); \
INSERT INTO site_checks (site_id, check_result, check_time) \
VALUES (?, ?, ?); \
COMMIT;';

  var id = uuid.v4();
  var createdDate = new Date();
  var checkInterval = 30;
  var checkTime = Math.floor((new Date).getTime()/1000) + checkInterval;

  pool
    .query(query, [id, name, url, checkInterval, createdDate, 1, 0, id, null, checkTime])
    .then(function _returnCreatedSite() {
      return cb(null, new Site({ id: id, name: name, url: url, check_interval: 30, createdDate: createdDate }));
    })
    .catch(function _rollbackTransactionOnError(err) {
      pool
        .query('ROLLBACK;')
        .then(function _returnError() {
          return cb(err);
        });
    });
}

function getSites(cb) {
  var query = '\
SELECT s.id, s.name, s.url, s.created_date AS \'createdDate\' \
FROM sites s \
WHERE s.is_active = 1 AND s.is_deleted = 0;';

  pool
    .query(query)
    .then(function _returnSites(rows) {
      return cb(null, rows.map(function _returnSite(row) { return new Site(row); }))
    })
    .catch(function _returnError(err) {
      return cb(err);
    });
}

function getSitesToCheck(cb) {
  var query = '\
SELECT s.id, s.name, s.url, s.check_interval AS \'checkInterval\', c.check_time AS \'checkTime\' \
FROM sites s JOIN site_checks c ON s.id = c.site_id \
WHERE s.is_active = 1 AND s.is_deleted = 0 AND c.check_time < ? AND c.check_result IS NULL;';

  var currentTime = Math.floor((new Date).getTime()/1000);

  pool
    .query(query, [currentTime])
    .then(function _returnSites(rows) {
      return cb(null, rows.map(function _returnSite(row) { return new Site(row); }))
    })
    .catch(function _returnError(err) {
      return cb(err);
    });
}

function recordSiteCheckResult(siteId, checkTime, checkResult, checkInterval, cb) {
  var query = '\
START TRANSACTION; \
UPDATE site_checks c \
SET check_result = ? \
WHERE site_id = ? AND check_time = ?; \
INSERT INTO site_checks (site_id, check_result, check_time) \
VALUES (?, ?, ?); \
COMMIT';

  var nextTime = Math.floor((new Date).getTime()/1000) + checkInterval;

  pool
    .query(query, [checkResult, siteId, checkTime, siteId, null, nextTime])
    .then(function _return() {
      return cb(null);
    })
    .catch(function _returnError(err) {
      return cb(err);
    });
}

module.exports = {
  createSite: createSite,
  getSites: getSites,
  getSitesToCheck: getSitesToCheck,
  recordSiteCheckResult: recordSiteCheckResult
};
