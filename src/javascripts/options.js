(function() {
  window.addEventListener('load', function() {
    var userName        = document.getElementById('user-name');
    var notifyEventToMe = document.getElementById('notify-event-to-me');
    var notifyNewInfo   = document.getElementById('notify-new-info');

    userName.value          = Configuration.get('user-name');
    notifyEventToMe.checked = Configuration.getBoolean('notify-event-to-me');
    notifyNewInfo.checked   = Configuration.getBoolean('notify-new-info');

    var form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
      Configuration.set('user-name',          userName.value);
      Configuration.set('notify-event-to-me', notifyEventToMe.checked);
      Configuration.set('notify-new-info',    notifyNewInfo.checked);

      close();
    });
  }, false);
}());
