'use strict';
var IMG_SIZE = 124;
var RATING_STAR = 30;
var reviewFilterBlock = document.querySelector('.reviews-filter');
var reviewBlock = document.querySelector('.reviews-list');
var templateElement = document.querySelector('template');
var elementToClone;

if('content' in templateElement) {
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
};

reviewFilterBlock.classList.add('invisible');

window.reviews.forEach(function(review) {
  getReviewElement(review, reviewBlock);
});

reviewFilterBlock.classList.remove('invisible');
