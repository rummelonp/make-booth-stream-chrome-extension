window.addEventListener('load', function() {
  var backgroundPage = chrome.extension.getBackgroundPage();
  var MakeBooth = backgroundPage.MakeBooth;

  if (! MakeBooth.hasConnection()) {
    MakeBooth.connect();
  }

  var data = MakeBooth.getData();
  var ul = document.createElement('ul');
  var html = '';
  for (var i = data.length - 1; i >= 0; i -= 1) {
    var datum = data[i];
    html += [
      '<li>',
      '    <div class="column-left">',
      '        <div class="user-image">',
      '            <img src="' + datum.user_image_file_name + '" />',
      '        </div>',
      '        <div class="event ' + datum.event_class + '"></div>',
      '    </div>',
      '    <div class="column-right">',
      '        <div class="text">' + datum.text + '</div>',
      '    </div>',
      '</li>'
    ].join("\n");
  }
  ul.innerHTML = html;
  document.body.appendChild(ul);
}, false);

