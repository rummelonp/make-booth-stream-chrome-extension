var MakeBooth = MakeBooth || (function() {
  var HOST         = 'http://makebooth.com';
  var IMAGE_HOST   = 'http://img.makebooth.com';
  var IMAGE_SMALL  = IMAGE_HOST + '/scale/c.50x50.';
  var IMAGE_BIG    = IMAGE_HOST + '/scale/c.170x135.';
  var EVENT_ICONS  = ['icon_watch', 'icon_exh', 'icon_fav_shop', 'icon_fav','icon_booth'];
  var ACTIVITY_URI = 'ws://ws.makebooth.com:5678/';

  var connection = null;
  var data = [];

  var connect = function() {
    connection = new WebSocket(ACTIVITY_URI);

    connection.onmessage = function(event) {
      var datum = JSON.parse(event.data);
      datum.text = datum.text.replace(/href="([^"]+)"/g, 'href="' + HOST + '$1" target="_blank"');
      datum.event_class = EVENT_ICONS[datum.event - 1];
      datum.created_at = new Date(datum.created_at);
      datum.image_file_name = IMAGE_BIG + datum.image_file_name;
      datum.image_file_link_path = HOST + datum.image_file_link_path;
      datum.user_image_file_name = datum.user_image_file_name?
        IMAGE_SMALL + datum.user_image_file_name:
        HOST + '/img/default_icon.png';
      data.push(datum);
    };

    connection.onclose = function(event) {
      connection = null;
    };

    return connection;
  };

  var hasConnection = function() {
    return !! connection;
  };

  var getData = function() {
    return data;
  };

  return {
    connect: connect,
    hasConnection: hasConnection,
    getData: getData
  };
}());
