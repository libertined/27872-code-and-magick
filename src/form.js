'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var formRequiredNotes = document.querySelectorAll('.review-form-control.review-fields label');
  var MARK_LIMIT = 3;
  var reviewForm = document.querySelector('form.review-form');
  var nameField = document.querySelector('#review-name');
  var markField = document.getElementsByName('review-mark');
  var browserCookies = require('browser-cookies');
  var textField = document.querySelector('#review-text');

  /** Изменяет блок с подсказками о заполнении полей
   */
  var chooseReviewNote = function() {
    var countVis = 0;
    for (var i = 0; i < formRequiredNotes.length; i++) {
      var curField = document.getElementById( formRequiredNotes[i].getAttribute('for') );
      if(curField.value.length <= 0 && curField.required) {
        formRequiredNotes[i].style.display = 'inline';
        countVis++;
      } else {
        formRequiredNotes[i].style.display = 'none';
      }
    }
    if(countVis > 0) {
      document.querySelector('.review-form-control.review-fields').style.display = 'inline-block';
      document.querySelector('.review-form-control.review-submit').disabled = true;
    } else {
      document.querySelector('.review-form-control.review-fields').style.display = 'none';
      document.querySelector('.review-form-control.review-submit').disabled = false;
    }
  };

  /** Проверяет будет ли отзыв обязательным
   * param {string} mark
   */
  var chooseRequiredText = function(mark) {
    if(+mark < MARK_LIMIT) {
      textField.required = true;
    } else {
      textField.required = false;
    }
  };

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  for(var i = 0; i < markField.length; i++) {
    markField[i].onchange = function() {
      if(this.checked) {
        chooseRequiredText(this.value);
        chooseReviewNote();
      }
    };
  }

  nameField.onchange = function() {
    chooseReviewNote();
  };

  textField.onchange = function() {
    chooseReviewNote();
  };

  //Первоначальные настройки
  nameField.value = browserCookies.get('name') || '';
  var defMark = browserCookies.get('mark') || 3;
  document.getElementById('review-mark-' + defMark).checked = true;

  chooseRequiredText(defMark);
  chooseReviewNote();

  reviewForm.onsubmit = function(evt) {
    evt.preventDefault();

    if(document.querySelector('.review-form-control.review-submit').disabled){
      alert('Вы ввели не корректные данные');
    } else {
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
    }
  };
})();
