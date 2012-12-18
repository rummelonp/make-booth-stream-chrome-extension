(function() {
  var GREEN = [0, 255, 0, 255];
  var RED   = [255, 0, 0, 255];

  var action = chrome.browserAction;

  var toggleBadge = function() {
    if (MakeBooth.hasConnection()) {
      var count = MakeBooth.getUnreadData().length;
      action.setBadgeBackgroundColor({color: GREEN});
      if (count > 0) {
        action.setBadgeText({text: count.toString()});
      } else {
        action.setBadgeText({text: ''});
      }
    } else {
      action.setBadgeBackgroundColor({color: RED});
      action.setBadgeText({text: '!'});
    }
  };

  var notify = (function() {
    var icon = 'images/icon19.png';
    var title = 'makebooth Stream';

    var showNotification = function(message, url) {
      var notification = webkitNotifications.createNotification(icon, title, message);
      notification.ondisplay = function() {
        setTimeout(function() {
          notification.cancel();
        }, 5000);
      };
      notification.onclick = function() {
        open(url);
        notification.cancel();
      };
      notification.show();
    };

    return function(datum) {
      var userName = Configuration.get('user-name');

      if (Configuration.getBoolean('notify-event-to-me')) {
        if (datum.shop_name_tag == userName) {
          showNotification(datum.plean_text, datum.image_file_link_path);
        }
      }

      if (Configuration.getBoolean('notify-new-info')) {
        if (datum.event == MakeBooth.EVENT_EXH) {
          showNotification(datum.plean_text, datum.image_file_link_path);
        }
      }
    };
  }());

  MakeBooth.on('popup', toggleBadge);
  MakeBooth.on('open', toggleBadge);
  MakeBooth.on('message', toggleBadge);
  MakeBooth.on('message', notify);
  MakeBooth.on('close', toggleBadge);

  MakeBooth.connect();
}());
