(function() {
  var backgroundPage = chrome.extension.getBackgroundPage();
  var MakeBooth = backgroundPage.MakeBooth;
  var filterEvent = Configuration.get('filter-event');
  var timeline = null;

  var createStatus = (function() {
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
        paddingLeft(date.getMonth() + 1, 2, '0') + '/' +
        paddingLeft(date.getDate(), 2, '0') + ' ' +
        paddingLeft(date.getHours(), 2, '0') + ':' +
        paddingLeft(date.getMinutes(), 2, '0');
    };

    return function(datum) {
      var status = document.createElement('li');
      status.className = 'status';
      status.setAttribute('data-event', datum.event_name);
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
  }());

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
    filterStatus(status);
    datum.readed = true;
  };

  var filterStatus = function(status) {
    var event = status.getAttribute('data-event');
    if (filterEvent == 'all' || event == filterEvent) {
      status.setAttribute('style', 'display: block;');
    } else {
      status.setAttribute('style', 'display: none;');
    }
  };

  var refilterStatuses = function() {
    if (! timeline) {
      return;
    }

    var statuses = timeline.querySelectorAll('.status');
    for (var i = statuses.length - 1; i >= 0; i -= 1) {
      filterStatus(statuses[i]);
    }
  };

  window.addEventListener('load', function() {
    if (! MakeBooth.hasConnection()) {
      MakeBooth.connect();
    }

    timeline = document.querySelector('.timeline');

    var data = MakeBooth.getData();
    for (var i = data.length - 1; i >= 0; i -= 1) {
      addStatusToTimeline(data[i]);
    }

    var eventFilter = document.querySelector('.event-filter');
    eventFilter.value = filterEvent;
    eventFilter.addEventListener('change', function() {
      filterEvent = eventFilter.value;
      Configuration.set('filter-event', filterEvent);
      refilterStatuses();
    }, false);

    MakeBooth.on('message', addStatusToTimeline);

    MakeBooth.trigger('popup');
  }, false);

  window.addEventListener('unload', function() {
    timeline = null;

    MakeBooth.off('message', addStatusToTimeline);
  });
}());
