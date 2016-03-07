'use strict';

var async = require('async');
var exec = require('child_process').exec;
var sys = require('sys');
var config = require('../config/config');

var SITE_STATUSES = {
  up: 'up',
  down: 'down'
};

/**
 * Gets the current status for a site. Uses `curl` to test site connectivity
 * site: an object of the form { name: 'name', host: 'http://example.com' }
 */
function getSiteStatus(site, cb) {
  console.log('checking ' + site.name + ' using host ' + site.host);
  exec('curl ' + site.host, function _handleCurlResult(err, stdout, stderr) {
    if (err) {
      return cb(SITE_STATUSES.down);
    }

    return cb(SITE_STATUSES.up);
  });
}

/**
 * Returns an array of functions to be comsumed by the async.parallel function
 * sites: an array of objects in the form { name: 'name', host: 'http://example.com' }
 */
function getCheckSiteFns(sites) {
  return sites.map(function _returnSiteCheck(site) {
    return function _siteCheck(callback) {
      getSiteStatus(site, function _returnStatus(status) {
        return callback(null, {
          site: site,
          status: status
        });
      });
    };
  });
}

function printResults(results) {
  function _printSiteResult(result) {
    console.log('site: ' + result.site.name + ' status: ' + result.status);
  }

  async.each(results, _printSiteResult);
}

var checkFns = getCheckSiteFns(config.sites)
var checkFns = [];
var interval = setInterval(function _performChecks() {
  if (checkFns.length === 0) {
    checkFns = getCheckSiteFns(config.sites);
  }

  async.parallel(checkFns, function _processResults(err, results) {
    printResults(results);
  });
}, config.checkInterval * 1000);

process.on('exit', function _handleExit(code) {
  console.log('exiting with code ' + code);
  clearInterval(interval);
});
