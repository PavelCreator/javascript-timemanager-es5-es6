logger = function(){
  console.log("time.h = ");console.log(data.time.h);
  console.log("time.m = ");console.log(data.time.m);
  console.log("time.s = ");console.log(data.time.s);
  console.log("timeInSec = ");console.log(data.timeInSec);
};
classFnc = {
  add: function (o, c) {
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    if (re.test(o.className)) return
    o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "")
  },
  remove: function (o, c) {
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "")
  }
};