'use strict';

/** @constant {int} */
var IMG_SIZE = 124;

/** @constant {int} */
var RATING_STAR = 30;

var templateElement = document.querySelector('template');
var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.review');
} else {
  elementToClone = templateElement.querySelector('.review');
}

/**
 * @param {Object} data
 * @param {HTMLElement} container
 * @return {HTMLElement}
 * */
var getReviewElement = function(data, container) {
  var element = elementToClone.cloneNode(true);

  var ratingWidth = RATING_STAR;//О идее тут нужно определить ширину одной зыездочки, но у меня не получилось
  element.querySelector('.review-rating').style.width = data.rating * ratingWidth + 'px';
  element.querySelector('.review-text').textContent = data.description;

  var avatarImg = new Image();

  avatarImg.onload = function() {
    element.querySelector('.review-author').src = avatarImg.src;
    element.querySelector('.review-author').width = IMG_SIZE;
    element.querySelector('.review-author').height = IMG_SIZE;
    element.querySelector('.review-author').alt = data.author.name;
    element.querySelector('.review-author').title = data.author.name;
  };

  avatarImg.onerror = function() {
    element.classList.add('review-load-failure');
  };

  avatarImg.src = data.author.picture;

  container.appendChild(element);
  return element;
};

/**
 * @param {Object} data
 * @param {Element} container
 * @constructor
 */
function Review(data, container) {
  this.data = data;
  this.element = getReviewElement(this.data, container);

  this.onQuizYes = function() {
    this.element.classList.add('review-quiz-answer-active');
  };

  this.onQuizNo = function() {
    this.element.classList.add('review-quiz-answer-active');
  };

  this.remove = function() {
    this.element.querySelector('.review-quiz-answer-yes').removeEventListener('click', this.onQuizYes);
    this.element.querySelector('.review-quiz-answer-no').removeEventListener('click', this.onQuizNo);
    this.element.parentNode.removeChild(this.element);
  };

  this.element.querySelector('.review-quiz-answer-yes').addEventListener('click', this.onQuizYes);
  this.element.querySelector('.review-quiz-answer-no').addEventListener('click', this.onQuizNo);
  container.appendChild(this.element);
}

module.exports = Review;
/* Я не поняла как это сделать с помощью AMD. Непонятно как мне передать парамтеры в конструктор класса
Делала так
define([
 './utils'
 ], function() {
 ......

 function Review(data, container) {
 ......
 }

 return new Review();
 });
* */
