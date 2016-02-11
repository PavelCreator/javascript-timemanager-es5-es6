events = {
  fieldFocusStopTimer: function () {
    var field = ['hour', 'min', 'sec'];
    for (var i = 0; i <= field.length - 1; i++) {
      document.getElementById(field[i]).onfocus = function () {
        view.ending.unset();
        timer.stop();
        if (data.flag.reverse) {
          timer.set(0);
        }
      };
    }
  },
  keypress: function () {
    window.captureEvents(Event.KEYPRESS);
    window.onkeypress = pressed;
    function pressed(e) {
      var ctrlDown = e.ctrlKey || e.metaKey
      switch (e.which) {
        case 32:
          document.getElementById('hidden').focus();
          timer.startOrStop();
          break;
        case 13:
          document.getElementById('hidden').focus();
          timer.startOrStop();
          break;
      }
      console.log(e.which);
    }
  },
  buttonPress: function () {
    var nums = ['0', '1', '2', '3', '5', '10', '15', '20', '30', '45', '60', '90', '120'];
    for (var i = 0; i <= nums.length - 1; i++) {
      document.getElementById("set" + nums[i]).onclick = (function (x) {
        return function () {
          timer.set(nums[x]);
        }
      })(i);
    }
    document.getElementById("push").onclick = function () {
      timer.startOrStop();
    }
    document.getElementById("sound").onclick = function () {
      view.setSoundMode();
    }
    document.getElementById("finish").onclick = function () {
      view.setFinishMode();
    }
  },
  resizeEvent: function(){
    addEvent(window, "resize", function (event) {
      view.setMarginTop();
    });
  }
}