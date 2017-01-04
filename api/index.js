var async = require('async');
var restify = require('restify');
var sites = require('./sites');

var server = restify.createServer();
server.use(restify.bodyParser());
server.post('/v1/sites', sites.createSite);
server.get('/v1/sites', sites.listSites);

server.listen(process.env.PORT, function _logSuccessfulStart() {
  console.log('%s listening at %s', server.name, server.url);
});
