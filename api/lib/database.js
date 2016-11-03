var mysql = require('promise-mysql');
var uuid = require('node-uuid');
var Site = require('./site');

var options = {
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'sites'
};

var pool = mysql.createPool(options);

function createSite(name, url, cb) {
  var query = '\
INSERT INTO sites (id, name, url, created_date, is_active, is_deleted) \
VALUES (?, ?, ?, ?, ?, ?);';

  var id = uuid.v4();
  var createdDate = new Date();

  pool
    .query(query, [id, name, url, createdDate, 1, 0])
    .then(function (rows) {
      return cb(null, new Site({ id: id, name: name, url: url, createdDate: createdDate }));
    })
    .catch(function (err) {
      return cb(err);
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
