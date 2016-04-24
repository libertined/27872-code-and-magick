'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var formRequiredNotes = document.querySelectorAll('.review-form-control.review-fields label');
  var MARK_LIMIT = 3;
  var nameField = document.querySelector('#review-name');
  var markField = document.getElementsByName('review-mark');
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
  for(var j = 0; j < markField.length; j++) {
    if(markField[j].checked) {
      chooseRequiredText(markField[j].value);
    }
  }
  chooseReviewNote();

})();
