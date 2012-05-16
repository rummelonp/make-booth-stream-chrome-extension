(function() {
  var backgroundPage = chrome.extension.getBackgroundPage();
  var MakeBooth = backgroundPage.MakeBooth;
  var timeline = null;

  var createStatus = function(datum) {
    var status = document.createElement('li');
    status.className = 'status';
    status.innerHTML = [
      '<div class="column-left">',
      '  <div class="user-image">',
      '    <img src="' + datum.user_image_file_name + '" />',
      '  </div>',
      '  <div class="event ' + datum.event_class + '"></div>',
      '</div>',
      '<div class="column-right">',
      '  <div class="text">' + datum.text + '</div>',
      '</div>'
    ].join("\n");

    return status;
  };

  var addStatusToTimeline = function(datum) {
    if (! timeline) {
      return;
    }

    var status = createStatus(datum);
    var childNodes = timeline.childNodes;
    if (childNodes.length > 0) {
      timeline.insertBefore(status, childNodes[0]);
    } else {
      timeline.appendChild(status);
    }
  };

  window.addEventListener('load', function() {
    if (! MakeBooth.hasConnection()) {
      MakeBooth.connect();
    }

    timeline = document.querySelector('.timeline');

    var data = MakeBooth.getData();
    for (var i = data.length - 1; i >= 0; i -= 1) {
      timeline.appendChild(createStatus(data[i]));
    }

    MakeBooth.on('message', addStatusToTimeline);
  }, false);

  window.addEventListener('unload', function() {
    timeline = null;

    MakeBooth.off('message', addStatusToTimeline);
  });
}());
