'use strict';

var exec = require('child_process').exec;
var sys = require('sys');
var config = require('../config/config');

var SITE_STATUSES = {
  up: 'up',
  down: 'down'
};

function getSiteStatus(site, cb) {
  console.log('checking ' + site.name + ' using host ' + site.host);
  exec('curl ' + site.host, function (err, stdout, stderr) {
    if (err) {
      return cb(SITE_STATUSES.down);
    }

    return cb(SITE_STATUSES.up);
  });
}

var interval = setInterval(function() {
  var sites = config.sites;
  sites.forEach(function (site) {
    getSiteStatus(site, function (status) {
      console.log('checked ' + site.name + '  STATUS: ' + status);
    });
  });
}, config.checkInterval * 1000);

process.on('exit', function(code) {
  console.log('exiting with code ' + code);
  clearInterval(interval);
});
