(function() {
  var backgroundPage = chrome.extension.getBackgroundPage();
  var MakeBooth = backgroundPage.MakeBooth;
  var timeline = null;

  var paddingLeft = function(input, length, string) {
    input = input.toString();
    string = string.toString();
    while (input.length < length) {
      input = string + input;
    }

    return input.substring(input.length - length, length);
  };

  var formatDate = function(date) {
    return date.getFullYear() + '/' +
      paddingLeft(date.getMonth(), 2, '0') + '/' +
      paddingLeft(date.getDate(), 2, '0') + ' ' +
      paddingLeft(date.getHours(), 2, '0') + ':' +
      paddingLeft(date.getMinutes(), 2, '0');
  };

  var createStatus = function(datum) {
    var status = document.createElement('li');
    status.className = 'status';
    status.innerHTML = [
      '<div class="column-left">',
      '  <div class="user-image">',
      '    <img src="' + datum.user_image_file_name + '" />',
      '  </div>',
      '</div>',
      '<div class="column-right">',
      '  <div class="event ' + datum.event_class + '"></div>',
      '  <div class="text">' + datum.text + '</div>',
      '  <div class="created_at">' + formatDate(datum.created_at) + '</div>',
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
    datum.readed = true;
  };

  window.addEventListener('load', function() {
    if (! MakeBooth.hasConnection()) {
      MakeBooth.connect();
    }

    timeline = document.querySelector('.timeline');

    var data = MakeBooth.getData();
    for (var i = data.length - 1; i >= 0; i -= 1) {
      var datum = data[i];
      timeline.appendChild(createStatus(datum));
      datum.readed = true;
    }

    MakeBooth.on('message', addStatusToTimeline);

    MakeBooth.trigger('popup');
  }, false);

  window.addEventListener('unload', function() {
    timeline = null;

    MakeBooth.off('message', addStatusToTimeline);
  });
}());
