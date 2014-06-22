var fs = require('fs');

/* Flat-file format for message storage. Each message is 
 * stored in a set of directories that represent their 
 * timestamp like this:
 *
 * <year>/<month>/<day>/<hour>/<minute>/<second>/<id>.yaml
 *
 */

var SEPARATOR = '.';

var pad = function(num) {
  var zero = 2 - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

var generateId = function() {
  var now = new Date();
  var id = [now.getUTCFullYear(), pad(now.getUTCMonth()+1), pad(now.getUTCDate()),
            pad(now.getUTCHours()), pad(now.getUTCMinutes()), pad(now.getSeconds())];
  console.log(now);
  return id.join(SEPARATOR);
};


console.log(generateId());




