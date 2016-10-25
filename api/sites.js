var uuid = require('node-uuid');
var sites = {};

function createSite(req, res, next) {
  if (!req.body || !req.body.name || !req.body.url) {
    res.send(400, 'site name and url required');
    next();
    return;
  }

  var id = uuid.v4();
  sites[id] = {
    id: id,
    name: req.body.name,
    url: req.body.url
  };
  res.send(201, sites[id]);
  next();
}

function getSite(req, res, next) {
  var site = sites[req.params.id];
  if (!site) {
    res.send(404, 'site not found');
    next();
    return;
  }
  res.send(200, site);
  next();
}

module.exports = {
  createSite: createSite,
  getSite: getSite
};
