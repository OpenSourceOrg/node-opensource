'use strict';

const https = require('https');
const path = require('path');
const Q = require('q');

function request(resource, callback) {
  let deferred = Q.defer();
  let options = {
    host: 'api.opensource.org',
    path: resource,
    method: 'GET'
  }

  https.get(options, function (res) {
    let body = '';

    res.on('data', function(data) {
      body += data;
    });

    res.on('end', function() {
      let data = JSON.parse(body)

      if (data.errors)
        deferred.reject(data.errors);
      else
        deferred.resolve(data);
    });
  });

  return deferred.promise.nodeify(callback);
}

// Get list of all known licenses
module.exports.all = function all(callback) {
  return request('/licenses/', callback);
}

// Get license by it's OSI ID
module.exports.get = function get(id, callback) {
  return request(path.join('/license', id), callback);
}

// Get license by a keyword
module.exports.tagged = function tagged(keyword, callback) {
  return request(path.join('/licenses', keyword), callback);
}
