var Configuration = Configuration || (function() {

  var camelize = function(string) {
    return string.replace(/-+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '' ;
    });
  };

  var set = function(key, value) {
    localStorage.setItem(camelize(key), value);
  };

  var get = function(key) {
    return localStorage.getItem(camelize(key));
  };

  var has = function(key) {
    return !! get(key);
  };

  var getBoolean = function(key, value) {
    return get(key) == 'true';
  };

  return {
    get: get,
    set: set,
    has: has,
    getBoolean: getBoolean
  };
}());
