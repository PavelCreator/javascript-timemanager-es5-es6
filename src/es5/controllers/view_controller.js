view = {
  startOrStop: function (startOrStop) {
    if (startOrStop === 'start') {
      classFnc.remove(document.getElementById('run'), 'active');
      classFnc.add(document.getElementById('stop'), 'active');
    } else {
      classFnc.remove(document.getElementById('stop'), 'active');
      classFnc.add(document.getElementById('run'), 'active');
    }
  },
  renewClockFace: function () {
    document.getElementById('hour').value = data.time.h;
    document.getElementById('min').value = data.time.m;
    document.getElementById('sec').value = data.time.s;
    this.renewTitle.timer();
  },
  renewTitle: {
    timer: function () {
      document.getElementById('title').innerHTML = data.time.h + ':' + data.time.m + ':' + data.time.s;
    },
    watch: function (h, m, s) {
      document.getElementById('title').innerHTML = h + ':' + m + ':' + s;
    }
  },
  reverse: {
    set: function () {
      data.flag.reverse = true;
      classFnc.add(document.getElementById('clock-face'), 'reverse');
    },
    unset: function () {
      data.flag.reverse = false;
      classFnc.remove(document.getElementById('clock-face'), 'reverse');
    }
  },
  ending: {
    set: function () {
      classFnc.add(document.getElementById('clock-face'), 'ending');
    },
    unset: function () {
      classFnc.remove(document.getElementById('clock-face'), 'ending');
    }
  },
  playSound: function () {
    data.audio.volume = data.audioSettings.volume;
    data.audio.src = '/timer/src/audio/' + data.audioSettings.url;
    data.audio.autoplay = true;
  },
  stopSound: function () {
    if (!data.audio.ended) {
      data.audio.pause();
    }
  },
  reset: function () {
    if (data.flag.mode === 'timer') {
      this.stopSound();
      this.reverse.unset();
      this.ending.unset();
      classFnc.remove(document.getElementById('set0'), 'stopwatch');
    } else {
      this.stopSound();
      this.reverse.unset();
      this.ending.unset();
    }
  },
  setSoundMode: function () {
    if (data.flag.sound) {
      data.flag.sound = false;
      localStorage.setItem("sound-play", "0");
      classFnc.add(document.getElementById('sound-off'), 'hide');
      classFnc.remove(document.getElementById('sound-on'), 'hide');
      classFnc.add(document.getElementById('settings-melody'), 'hide');
      classFnc.remove(document.getElementById('settings-alarm-on'), 'active');
      classFnc.add(document.getElementById('settings-alarm-off'), 'active');
    } else {
      data.flag.sound = true;
      localStorage.setItem("sound-play", "1");
      classFnc.remove(document.getElementById('sound-off'), 'hide');
      classFnc.add(document.getElementById('sound-on'), 'hide');
      classFnc.remove(document.getElementById('settings-melody'), 'hide');
      classFnc.add(document.getElementById('settings-alarm-on'), 'active');
      classFnc.remove(document.getElementById('settings-alarm-off'), 'active');
    }
  },
  setFinishMode: function () {
    if (data.flag.finish) {
      data.flag.finish = false;
      localStorage.setItem("finish", "0");
      classFnc.remove(document.getElementById('finish-on'), 'hide');
      classFnc.add(document.getElementById('finish-off'), 'hide');
      classFnc.add(document.getElementById('settings-end-continue'), 'active');
      classFnc.remove(document.getElementById('settings-end-stop'), 'active');
    } else {
      data.flag.finish = true;
      localStorage.setItem("finish", "1");
      classFnc.add(document.getElementById('finish-on'), 'hide');
      classFnc.remove(document.getElementById('finish-off'), 'hide');
      classFnc.remove(document.getElementById('settings-end-continue'), 'active');
      classFnc.add(document.getElementById('settings-end-stop'), 'active');
    }
  },
  setMarginTop: function () {
    var body = document.body,
      html = document.documentElement;

    var height = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);

    if (height > 600) {
      var marginTop = (height - 600) * 0.37;
      document.getElementById('app-wrapper').style.marginTop = marginTop + 'px';
    }
  },
  setMelodyPlay: function (melodyPlay) {
    if (melodyPlay) {
      classFnc.remove(document.getElementById('settings-melody-stop'), 'hide');
      classFnc.add(document.getElementById('settings-melody-play'), 'hide');
      this.playSound();
      data.audio.onended = function () {
        view.setMelodyPlay(false);
      };
    } else {
      classFnc.remove(document.getElementById('settings-melody-play'), 'hide');
      classFnc.add(document.getElementById('settings-melody-stop'), 'hide');
      this.stopSound();
    }
  },
  buildMelodiesList: function () {
    var melodiesList = '',
      volumeList = '';

    var defaultMelody = localStorage.getItem("sound-melody")
      ? localStorage.getItem("sound-melody")
      : 0;
    for (var i = 0; i < data.audios.length; i++) {
      melodiesList += (i == defaultMelody)
        ? '<option value="' + i + '" selected>' + data.audios[i].name + '</option>'
        : '<option value="' + i + '">' + data.audios[i].name + '</option>';
    }

    var defaultVolume = localStorage.getItem("sound-volume")
      ? localStorage.getItem("sound-volume") * 10
      : 7;
    for (var i = 10; i > 0; i--) {
      volumeList += (i == defaultVolume)
        ? '<option value="' + i / 10 + '" selected>' + i * 10 + '%</option>'
        : '<option value="' + i / 10 + '">' + i * 10 + '%</option>';
    }

    document.getElementById('melodies-list').innerHTML = melodiesList;
    document.getElementById('volume-list').innerHTML = volumeList;
  },
  setSettingsFromStorage: function () {
    var
      soundMelodyId = localStorage.getItem("sound-melody"),
      soundVolume = localStorage.getItem("sound-volume"),
      finish = localStorage.getItem("finish"),
      soundPlay = localStorage.getItem("sound-play"),
      showWatch = localStorage.getItem("show-watch"),
      mode = localStorage.getItem("mode");

    if (soundMelodyId) {
      document.getElementById('settings-melody-name').innerHTML = data.audios[soundMelodyId].name;
      data.audioSettings.url = data.audios[soundMelodyId].url;
    }
    if (soundVolume) {
      data.audioSettings.volume = soundVolume;
    }
    if (finish === '1') {
      this.setFinishMode();
    }
    if (soundPlay === '0') {
      this.setSoundMode();
    }
    if (showWatch === '0') {
      this.toggleWatch();
    }
    if (mode) {
      timer.changeMode(mode);
      view.changeMode();
    }
  },
  setTimeFromKey: function (fieldName, num, pos) {
    var posEnd, shortFieldName = fieldName.charAt(0);
    /*    console.log("fieldName =", fieldName);
     console.log("num =", num);
     console.log("pos =", pos);*/
    switch (pos) {
      case 0:
        switch (num) {
          case 'left':
          case 'blackspace':
            switch (shortFieldName) {
              case 'm':
                document.getElementById('hour').focus();
                document.getElementById('hour').setSelectionRange(2, 2);
                break;

              case 's':
                document.getElementById('min').focus();
                document.getElementById('min').setSelectionRange(2, 2);
                break;
            }
            return false;
            break;

          case 'right':
            posEnd = 1;
            break;

          case 'delete':
            data.time[shortFieldName] = '0' + data.time[shortFieldName].charAt(1);
            posEnd = 1;
            break;

          default:
            data.time[shortFieldName] = num + data.time[shortFieldName].charAt(1);
            posEnd = 1;
            break;
        }
        break;

      case 1:
        switch (num) {
          case 'left':
            posEnd = 0;
            break;

          case 'right':
            posEnd = 2;
            break;

          case 'delete':
            data.time[shortFieldName] = data.time[shortFieldName].charAt(0) + '0';
            posEnd = 2;
            break;

          case 'blackspace':
            data.time[shortFieldName] = '0' + data.time[shortFieldName].charAt(1);
            posEnd = 0;
            break;

          default:
            data.time[shortFieldName] = data.time[shortFieldName].charAt(0) + num;
            view.renewClockFace();
            switch (shortFieldName) {
              case 'h':
                document.getElementById('min').focus();
                document.getElementById('min').setSelectionRange(0, 0);
                break;

              case 'm':
                document.getElementById('sec').focus();
                document.getElementById('sec').setSelectionRange(0, 0);
                break;
            }
            return false;
            break;
        }
        break;

      case 2:
        switch (num) {
          case 'left':
            posEnd = 1;
            break;

          case 'right':
          case 'delete':
            switch (shortFieldName) {
              case 'h':
                document.getElementById('min').focus();
                document.getElementById('min').setSelectionRange(0, 0);
                break;

              case 'm':
                document.getElementById('sec').focus();
                document.getElementById('sec').setSelectionRange(0, 0);
                break;
            }
            return false;
            break;

          case 'blackspace':
            data.time[shortFieldName] = data.time[shortFieldName].charAt(0) + '0';
            posEnd = 1;
            break;

          default:
            return 2;
            break;
        }
        break;
    }
    view.renewClockFace();
    return posEnd;
  },
  warning: {
    finishOff: function () {
      classFnc.add(document.getElementById('finish-off'), 'warning');
      setTimeout(function () {
        classFnc.remove(document.getElementById('finish-off'), 'warning');
      }, 1000);
    },
    reset: function () {
      classFnc.add(document.getElementById('set0'), 'stopwatch');
    }
  },
  toggleWatch: function () {
    if (data.flag.showWatch) {
      data.flag.showWatch = false;
      localStorage.setItem("show-watch", "0");
      classFnc.add(document.getElementById('watch-clock-face'), 'transparent');
      classFnc.remove(document.getElementById('toggle-watch-icon-show'), 'hide');
      classFnc.add(document.getElementById('toggle-watch-icon-hide'), 'hide');
      classFnc.remove(document.getElementById('settings-watch-show'), 'active');
      classFnc.add(document.getElementById('settings-watch-hide'), 'active');
    } else {
      data.flag.showWatch = true;
      localStorage.setItem("show-watch", "1");
      classFnc.remove(document.getElementById('watch-clock-face'), 'transparent');
      classFnc.add(document.getElementById('toggle-watch-icon-show'), 'hide');
      classFnc.remove(document.getElementById('toggle-watch-icon-hide'), 'hide');
      classFnc.add(document.getElementById('settings-watch-show'), 'active');
      classFnc.remove(document.getElementById('settings-watch-hide'), 'active');
    }
  },
  changeMode: function () {
    switch (data.flag.mode) {
      case 'timer':
        localStorage.setItem("mode", "timer");
        classFnc.add(document.getElementById('settings-mode-timer'), 'active');
        classFnc.remove(document.getElementById('settings-mode-stopwatch'), 'active');
        classFnc.remove(document.getElementById('settings-mode-watch'), 'active');
        this.modeView.watch(false);
        this.modeView.sropwatch(false);
        this.modeView.timer(true);
        break;

      case 'stopwatch':
        localStorage.setItem("mode", "stopwatch");
        view.reverse.set();
        classFnc.remove(document.getElementById('settings-mode-timer'), 'active');
        classFnc.add(document.getElementById('settings-mode-stopwatch'), 'active');
        classFnc.remove(document.getElementById('settings-mode-watch'), 'active');
        this.modeView.watch(false);
        this.modeView.sropwatch(true);
        this.modeView.timer(false);
        break;

      case 'watch':
        localStorage.setItem("mode", "watch");
        classFnc.remove(document.getElementById('settings-mode-timer'), 'active');
        classFnc.remove(document.getElementById('settings-mode-stopwatch'), 'active');
        classFnc.add(document.getElementById('settings-mode-watch'), 'active');
        this.modeView.watch(true);
        this.modeView.sropwatch(false);
        this.modeView.timer(false);
        break;
    }
  },
  modeView: {
    timer: function (bool) {
      if (bool) {
        document.getElementById('sound').disabled = false;
        document.getElementById('finish').disabled = false;
        classFnc.remove(document.getElementById('settings-alarm-wrapper'), 'hide');
        classFnc.remove(document.getElementById('settings-end-continue-wrapper'), 'hide');
        if (data.flag.sound) {
          classFnc.remove(document.getElementById('settings-melody'), 'hide');
        }
      } else {
        document.getElementById('sound').disabled = true;
        document.getElementById('finish').disabled = true;
        classFnc.add(document.getElementById('settings-alarm-wrapper'), 'hide');
        classFnc.add(document.getElementById('settings-end-continue-wrapper'), 'hide');
        classFnc.add(document.getElementById('settings-melody'), 'hide');
      }
    },
    sropwatch: function (bool) {
      for (var i = 0; i <= data.timeButtonArr.length - 1; i++) {
        if (bool) {
          classFnc.add(document.getElementById("set" + data.timeButtonArr[i]), 'stopwatch');
        } else {
          classFnc.remove(document.getElementById("set" + data.timeButtonArr[i]), 'stopwatch');
        }
      }
    },
    watch: function (bool) {
      if (bool) {
        classFnc.add(document.getElementById('clock-face'), 'hide');
        classFnc.remove(document.getElementById('w-clock-face'), 'hide');
        classFnc.add(document.getElementById('watch-clock-face'), 'transparent');
        document.getElementById('push').disabled = true;
        view.state.timeButtons('disable');
      } else {
        classFnc.remove(document.getElementById('clock-face'), 'hide');
        classFnc.add(document.getElementById('w-clock-face'), 'hide');
        classFnc.remove(document.getElementById('watch-clock-face'), 'transparent');
        document.getElementById('push').disabled = false;
        view.state.timeButtons('enable');
      }
    }
  },
  state: {
    timeButtons: function (state) {
      for (var i = 0; i <= data.timeButtonArr.length - 1; i++) {
        switch (state) {
          case 'disable':
            document.getElementById("set" + data.timeButtonArr[i]).disabled = true;
            break;

          case 'enable':
            document.getElementById("set" + data.timeButtonArr[i]).disabled = false;
            break;
        }
      }
    }
  }
}
