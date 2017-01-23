var db = require('site-monitor-common').database;

function createSite(req, res, next) {
  if (!req.body || !req.body.name || !req.body.url) {
    res.send(400, 'site name and url required');
    return next();
  }

  db.createSite(req.body.name, req.body.url, function _createSite(err, createdSite) {
    if (err)
      return next(err);

    res.send(201, createdSite);
    next();
  });
}

function listSites(req, res, next) {
  db.getSites(function _getSites(err, sites) {
    if (err)
      return next(err);

    res.send(200, { sites: sites });
    next();
  });
}

module.exports = {
  createSite: createSite,
  listSites: listSites
};
