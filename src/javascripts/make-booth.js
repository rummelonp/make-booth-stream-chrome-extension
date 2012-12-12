var MakeBooth = MakeBooth || (function() {
  var HOST           = 'http://makebooth.com';
  var IMAGE_HOST     = 'http://img.makebooth.com';
  var IMAGE_SMALL    = IMAGE_HOST + '/scale/c.50x50.';
  var IMAGE_BIG      = IMAGE_HOST + '/scale/c.170x135.';
  var EVENT_ICONS    = ['icon_watch', 'icon_exh', 'icon_fav_shop', 'icon_fav', 'icon_booth', 'icon_comment'];
  var EVENT_WATCH    = 1;
  var EVENT_EXH      = 2;
  var EVENT_FAV_SHOP = 3;
  var EVENT_FAV      = 4;
  var EVENT_BOOTH    = 5;
  var ACTIVITY_URI   = 'ws://ws.makebooth.com:5678/';

  var connection = null;
  var data = [];
  var events = {};

  var connect = function() {
    connection = new WebSocket(ACTIVITY_URI);

    connection.onopen = function(event) {
      trigger('open');
    };

    connection.onmessage = function(event) {
      var datum = JSON.parse(event.data);
      datum.readed = false;
      datum.text = datum.text
        .replace(/href="([^"]+)"/g, 'href="' + HOST + '$1" target="_blank"')
        .replace(/(<[^>]+>)/g, ' $1')
        .replace(/(<\/[^>]+>)/g, '$1 ');
      datum.plean_text = datum.text.replace(/<\/?[^>]*>/g, '');
      datum.event_class = EVENT_ICONS[datum.event - 1];
      datum.created_at = new Date(datum.created_at);
      datum.image_file_name = IMAGE_BIG + datum.image_file_name;
      datum.image_file_link_path = HOST + datum.image_file_link_path;
      datum.user_image_file_name = datum.user_image_file_name?
        IMAGE_SMALL + datum.user_image_file_name:
        HOST + '/img/default_icon.png';
      data.push(datum);

      trigger('message', [datum]);
    };

    connection.onclose = function(event) {
      connection = null;

      trigger('close');
    };

    return connection;
  };

  var hasConnection = function() {
    return !! connection;
  };

  var getData = function() {
    return data;
  };

  var getUnreadData = function() {
    var unreadData = [];
    for (var i = 0, l = data.length; i < l; i += 1) {
      var datum = data[i];
      if (! datum.readed) {
        unreadData.push(datum);
      }
    }

    return unreadData;
  };

  var on = function(name, handler) {
    if (! events[name]) {
      events[name] = [];
    }
    events[name].push(handler);
  };

  var off = function(name, handler) {
    var handlers = events[name];
    if (! handlers) {
      return;
    }

    for (var i = handlers.length - 1; i >= 0; i -= 1) {
      if (handlers[i] == handler) {
        handlers.splice(i, 1);
        break;
      }
    }
  };

  var trigger = function(name, args) {
    var handlers = events[name];
    if (! handlers) {
      return;
    }

    for (var i = handlers.length - 1; i >= 0; i -= 1) {
      var handler = handlers[i];
      if (handler) {
        handler.apply(null, args);
      }
    }
  };

  return {
    EVENT_WATCH: EVENT_WATCH,
    EVENT_EXH: EVENT_EXH,
    EVENT_FAV_SHOP: EVENT_FAV_SHOP,
    EVENT_FAV: EVENT_FAV,
    EVENT_BOOTH: EVENT_BOOTH,
    connect: connect,
    hasConnection: hasConnection,
    getData: getData,
    getUnreadData: getUnreadData,
    on: on,
    off: off,
    trigger: trigger
  };
}());
