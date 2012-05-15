(function() {
  var GREEN = [0, 255, 0, 255];
  var RED   = [255, 0, 0, 255];

  var action = chrome.browserAction;

  MakeBooth.observe('open', function() {
    action.setBadgeBackgroundColor({color: GREEN});
    action.setBadgeText({text: MakeBooth.getData().length.toString()});
  });

  MakeBooth.observe('message', function() {
    action.setBadgeBackgroundColor({color: GREEN});
    action.setBadgeText({text: MakeBooth.getData().length.toString()});
  });

  MakeBooth.observe('close', function() {
    action.setBadgeBackgroundColor({color: RED});
    action.setBadgeText({text: '!'});
  });

  MakeBooth.connect();
}());
