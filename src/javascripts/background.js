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

  MakeBooth.on('popup', toggleBadge);
  MakeBooth.on('open', toggleBadge);
  MakeBooth.on('message', toggleBadge);
  MakeBooth.on('close', toggleBadge);

  MakeBooth.connect();
}());
