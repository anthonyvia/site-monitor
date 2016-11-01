var async = require('async');
var restify = require('restify');
var sites = require('./sites');

var server = restify.createServer();
server.use(restify.bodyParser());
server.post('/v1/sites', sites.createSite);

server.listen(process.env.PORT, function () {
  console.log('%s listening at %s', server.name, server.url);
});
