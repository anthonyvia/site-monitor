var async = require('async');
var request = require('request');
var db = require('site-monitor-common').database;
var logger = require('site-monitor-common').logger.createLogger('monitor');

var RESULT_CODE_FAIL = 0;
var RESULT_CODE_SUCCESS = 1;
var HTTP_STATUS_OK = 200;
var INTERVAL_MS = 30 * 1000;

function checkSite(uri, cb) {
  request(uri, function (err, response, body) {
    var resultCode;
    if (err || response.statusCode != HTTP_STATUS_OK) {
      logger.error(err);
      resultCode = RESULT_CODE_FAIL;
    } else if (response.statusCode != HTTP_STATUS_OK) {
      logger.error('http status code not 200: ' + response.statusCode);
      resultCode = RESULT_CODE_FAIL;
    } else {
      logger.info('succeeded for ' + uri);
      resultCode = RESULT_CODE_SUCCESS;
    }

    return cb(null, resultCode);
  });
}

function recordSiteCheckResult(siteId, checkTime, result, checkInterval, cb) {
  db.recordSiteCheckResult(siteId, checkTime, result, checkInterval, cb);
}

function start() {
  db.getSitesToCheck(function _logSites(err, sites) {
    if (err) {
      throw err;
    }

    if (!sites) {
      throw new Error('sites is invalid');
    }

    function _runCheck(siteId, uri, checkTime, checkInterval) {
      async.waterfall([
        function (callback) {
          checkSite(uri, function (err, resultCode) {
            return callback(err, resultCode);
          });
        },
        function (resultCode, callback) {
          db.recordSiteCheckResult(siteId, checkTime, resultCode, checkInterval, function (err) {
            return callback(err);
          });
        }
      ], function (err, results) {
        if (err) {
          logger.error(err);
        } else {
          logger.info('checked site successfully');
        }
      });
    }

    var length = sites.length;
    for (var i = 0; i < length; i++) {
      var site = sites[i];
      var uri = site.url;

      // TODO: defaulting to http for now, allow user to specify http/https later
      if (!uri.match(/http[s]*:\/\/./)) {
        uri = 'http://' + uri;
      }

      _runCheck(site.id, uri, site.checkTime, site.checkInterval);
    }
  });
}

var interval = setInterval(start, INTERVAL_MS);
process.on('SIGTERM', function () {
  logger.info('SIGTERM received, exiting');
  clearInterval(interval);
  process.exit(1);
});

process.on('exit', function(code) {
  clearInterval(interval);
  logger.info('exiting with code: ' + code);
});
