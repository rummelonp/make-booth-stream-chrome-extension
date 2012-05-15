var MakeBooth = MakeBooth || (function() {
  var MakeBooth = {};
  var connection = null;

  MakeBooth.HOST         = 'http://makebooth.com';
  MakeBooth.IMAGE_HOST   = 'http://img.makebooth.com';
  MakeBooth.IMAGE_SMALL  = MakeBooth.IMAGE_HOST + '/scale/c.50x50.';
  MakeBooth.IMAGE_BIG    = MakeBooth.IMAGE_HOST + '/scale/c.170x135.';
  MakeBooth.EVENT_ICONS  = ['icon_watch', 'icon_exh', 'icon_fav_shop', 'icon_fav','icon_booth'];
  MakeBooth.ACTIVITY_URI = 'ws://ws.makebooth.com:5678/';

  MakeBooth.data = [];

  MakeBooth.connect = function() {
    connection = new WebSocket(MakeBooth.ACTIVITY_URI);

    connection.onmessage = function(event) {
      var datum = JSON.parse(event.data);
      datum.created_at = new Date(datum.created_at);
      datum.image_file_link_path = MakeBooth.HOST + datum.image_file_link_path;
      datum.image_file_name = MakeBooth.IMAGE_BIG + datum.image_file_name;
      datum.text = datum.text.replace(/href="([^"]+)"/g, 'href="' + MakeBooth.HOST + '$1" target="_blank"');
      datum.user_image_file_name = datum.user_image_file_name?
        MakeBooth.IMAGE_SMALL + datum.user_image_file_name:
        MakeBooth.HOST + '/img/default_icon.png';
      MakeBooth.data.push(datum);
    };

    connection.onclose = function(event) {
      connection = null;
    };

    return connection;
  };

  MakeBooth.hasConnection = function() {
    return !! connection;
  };

  return MakeBooth;
}());
