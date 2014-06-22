var fs = require('fs'),
    yaml = require('js-yaml'),
    async = require('async'),
    _ = require('underscore');

/* Flat-file format for message storage. Each message is 
 * stored in a set of directories that represent their 
 * timestamp like this:
 *
 * <year>/<month>/<day>/<hour>/<minute>/<second>/<id>.yaml
 *
 */

var SEPARATOR = '-',
    DATA_PATH = process.env.DATA_PATH,
    MSG_PATH = null;


exports.init = function() {
  if (_.isUndefined(DATA_PATH)) {
    console.log("You haven't set a DATA_PATH environment variable!");
  }

  // Create necessary paths:
  if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH);
  }
  MSG_PATH = DATA_PATH + '/messages';
  if (!fs.existsSync(MSG_PATH)) {
    fs.mkdirSync(MSG_PATH);
  }
};


var pad = function(num) {
  var zero = 2 - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}


var uniqueId = function() {
  return 'xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};


var generateId = function() {
  var now = new Date();
  var id = [now.getUTCFullYear(), pad(now.getUTCMonth()+1),
            pad(now.getUTCDate()), pad(now.getUTCHours()),
            pad(now.getUTCMinutes()), pad(now.getSeconds()),
            uniqueId()];
  return id.join(SEPARATOR);
};


exports.idToPath = function(id) {
  var elements = id.split(SEPARATOR),
      path = MSG_PATH + '';
  elements.forEach(function(e, i) {
    path = path + '/' + e;
    if (i == elements.length - 1) {
      path = path + '.yaml';
    } else {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
    }
  });
  return path;
};


exports.traverse = function(limit, offset, callback) {
  var results = [],
      skipped = 0,
      total = 0;
  var traverseInner = function(prefix) {
    var files = fs.readdirSync(prefix).sort().reverse();
    for (var i = 0; i < files.length; i++) {
      var fn = files[i],
          fullpath = prefix + '/' + fn;
      if (fn.indexOf('.yaml') != -1) {
        total++;
        if (offset > skipped) {
          skipped++;
        } else {
          if (results.length < limit) {
            results.push(fullpath);
          }
        }
      } else {
        traverseInner(fullpath);
      }
    }
  }
  traverseInner(MSG_PATH);
  callback(results, total);
};


exports.create = function(data, callback) {
  var id = generateId(),
      path = exports.idToPath(id);

  data.id = id;
  fs.writeFile(path, yaml.dump(data), function(err, data) {
    if (!_.isUndefined(callback)) {
      callback(id);
    }
  });
};


exports.read = function(path, callback) {
  fs.readFile(path, function(err, data) {
    var obj = yaml.load(data + '');
    callback(err, obj); 
  });
}

exports.init();
