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

  pool
    .query(query, [id, name, url, 30, createdDate, 1, 0, id, null, 12])
    .then(function () {
      return cb(null, new Site({ id: id, name: name, url: url, check_interval: 30, createdDate: createdDate }));
    })
    .catch(function (err) {
      pool
        .query('ROLLBACK;')
        .then(function () {
          return cb(err);
        });
    });
}

function getSites(cb) {
  var query = '\
SELECT s.id, s.name, s.url, s.created_date AS \'createdDate\'\
FROM sites s \
WHERE s.is_active = 1 AND s.is_deleted = 0;';

  pool
    .query(query)
    .then(function (rows) {
      return cb(null, rows.map(function (row) { return new Site(row); }))
    })
    .catch(function (err) {
      return cb(err);
    });
}

module.exports = {
  createSite: createSite,
  getSites: getSites
};
