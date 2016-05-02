'use strict';

define(function() {
  return function(url, sucsess, error) {
    var xhr = new XMLHttpRequest();

    /** @param {ProgressEvent} */
    xhr.onload = function(evt) {
      var loadedData = JSON.parse(evt.target.response);
      sucsess(loadedData);
    };

    /** @param {ProgressEvent} */
    xhr.onerror = function() {
      error();
    };

    xhr.timeout = 10000;
    /** @param {ProgressEvent} */
    xhr.ontimeout = function() {
      error();
    };

    xhr.open('GET', url);
    xhr.send();
  };
});
