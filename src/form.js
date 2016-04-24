'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var reviewForm = document.querySelector('form.review-form');
  var nameField = document.querySelector('#review-name');
  var markField = document.getElementsByName('review-mark');
  var browserCookies = require('browser-cookies');

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  reviewForm.onsubmit = function(evt) {
    evt.preventDefault();

    //Определяем текущую дату
    var today = new Date();
    var myBidth = new Date(today.getFullYear() + '-04-28');
    if(myBidth.valueOf() > today.valueOf()) {
      myBidth = new Date(today.getFullYear() - 1 + '-04-28');
    }
    var dateToCookies = today.valueOf() - myBidth.valueOf();

    var curMark = '';
    for(var j = 0; j < markField.length; j++) {
      if (markField[j].checked) {
        curMark = markField[j].value;
      }
    }

    browserCookies.set('mark', curMark, {
      expires: today.valueOf + dateToCookies
    });
    browserCookies.set('name', nameField.value, {
      expires: today.valueOf + dateToCookies
    });

    this.submit();
  };

  //Первоначальные настройки
  nameField.value = browserCookies.get('name') || '';
  var defMark = browserCookies.get('mark') || 3;
  document.getElementById('review-mark-' + defMark).checked = true;

})();
