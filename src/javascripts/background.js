(function() {
  var GREEN = [0, 255, 0, 255];
  var RED   = [255, 0, 0, 255];

  var action = chrome.browserAction;

  var toggleBadge = function() {
    if (MakeBooth.hasConnection()) {
      var count = MakeBooth.getData().length;
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

  MakeBooth.observe('open', toggleBadge);
  MakeBooth.observe('message', toggleBadge);
  MakeBooth.observe('close', toggleBadge);

  MakeBooth.connect();
}());
