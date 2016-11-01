var db = require('./lib/database');

function createSite(req, res, next) {
  if (!req.body || !req.body.name || !req.body.url) {
    res.send(400, 'site name and url required');
    return next();
  }

  var site = {
    name: req.body.name,
    url: req.body.url
  };

  db.createSite(site, function (err, createdSite) {
    if (err)
      return next(err);

    res.send(201, createdSite);
    next();
  });
}

module.exports = {
  createSite: createSite
};
