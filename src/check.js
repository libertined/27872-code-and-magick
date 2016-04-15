'use strict';
//getMessage(a:*, b:*=):string  ?? *-любой, а *=, предопределенное значение?
var getMessage = function(a, b) {
  var res = '';
  switch (typeof a) {
    case 'boolean':
      if(a) {
        res = 'Я попал в ' + b;
      } else {
        res = 'Я никуда не попал';
      }
      break;
    case 'number':
      res = 'Я прыгнул на ' + a * 100 + ' сантиметров';
      break;
    default:
      var sum = 0;
      if (a instanceof Array && b instanceof Array) {
        var minLength = Math.min(a.length, b.length);
        for (var i = 0; i < minLength; i++) {
          sum += a[i] * b[i];
        }
        res = 'Я прошёл ' + sum + ' метров';
      } else if (a instanceof Array) {
        var aLength = a.length;
        for (var j = 0; j < aLength; j++) {
          sum += a[j];
        }
        res = 'Я прошёл ' + sum + ' шагов';
      }
      break;
  }
  return res;
};
