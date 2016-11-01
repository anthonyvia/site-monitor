var mysql = require('promise-mysql');
var uuid = require('node-uuid');

var options = {
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'sites'
};

var pool = mysql.createPool(options);

function createSite(site, cb) {
  var query = '\
INSERT INTO sites (id, name, url, created_date, is_active, is_deleted) \
VALUES (?, ?, ?, ?, ?, ?);';

  var id = uuid.v4();
  var createdDate = new Date();

  pool
    .query(query, [id, site.name, site.url, createdDate, 1, 0])
    .then(function (rows) {
      return cb(null, { id: id, name: site.name, url: site.url, createdDate: createdDate });
    })
    .catch(function (err) {
      return cb(err);
    });
}

module.exports = {
  createSite: createSite
};
