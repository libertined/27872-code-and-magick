'use strict';

define(function() {
  /** @constant {string} */
  var HIDDEN_CLASSNAME = 'invisible';

  /** @constant {number} */
  var GAP = 50;

  /** @enum {number} */
  var KeyCode = {
    ENTER: 13,
    ESC: 27,
    SPACE: 32
  };


  return {
    /**
     * @param {Node} element
     * @return {boolean}
     */
    elementIsAtTheBottom: function(element) {
      var elementPosition = element.getBoundingClientRect();
      return elementPosition.top - window.innerHeight - GAP <= 0;
    },

    /**
     * @param {number} listSize
     * @param {number} page
     * @param {number} pageSize
     * @return {boolean}
     */
    isNextPageAvailable: function(listSize, page, pageSize) {
      return page < Math.floor(listSize.length / pageSize);
    },

    /**
     * @param {Event} evt
     * @return {boolean}
     */
    isDeactivationEvent: function(evt) {
      return evt.keyCode === KeyCode.ESC;
    },


    /**
     * @param {Element} element
     * @param {boolean} hidden
     */
    setElementHidden: function(element, hidden) {
      element.classList.toggle(HIDDEN_CLASSNAME, hidden);
    },


    /**
     * @param {Function} fn
     * @param {number} timeout
     * @return {Function} [description]
     */
    throttle: function(fn, timeout) {
      return function() {
        clearTimeout(fn._timeoutID);
        fn._timeoutID = setTimeout(fn, timeout);
      };
    }
  };
});
