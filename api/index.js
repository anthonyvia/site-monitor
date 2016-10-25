var async = require('async');
var restify = require('restify');

var sites = require('./sites');


var server = restify.createServer();
server.use(restify.bodyParser());
server.post('/sites', sites.createSite);
server.get('/sites/:id', sites.getSite);

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
