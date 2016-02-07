var timer = {
  startOrStop: function () {
    if (data.flag.stop) {
      this.start();
      data.flag.stop = false;
    } else {
      this.stop();
    }
  },
  set: function (timeInMin) {
    view.reverse.unset();
    view.ending.unset();
    data.timeInSec = timeInMin * 60;
    if (!data.flag.stop) {
      this.stop();
      data.flag.stop = true;
    }
    timerSvc.fromSecToTime();
    view.renewClockFace();
  },
  playSound: function () {
    var audio = new Audio();
    audio.src = '../../audio/ring.mp3';
    audio.autoplay = true;
  },
  start: function () {
    oneSec = setTimeout(function () {
      timerSvc.getValuesFromHTML();
      timerSvc.fromTimeToSec();
      if ((data.timeInSec <= 6) && (!data.flag.reverse)) {
        view.ending.set();
      }
      if (data.timeInSec == 0) {
        if (data.flag.sound) {
          timer.playSound();
        }
        view.ending.unset();
        view.reverse.set();
      }
      if (data.flag.reverse) {
        data.timeInSec++;
      } else {
        data.timeInSec--;
      }
      timerSvc.fromSecToTime();
      view.renewClockFace();
      timer.start();
    }, 1000);
  },
  stop: function () {
    clearTimeout(oneSec);
    data.flag.stop = true;
  },
}
