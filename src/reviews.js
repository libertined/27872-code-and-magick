'use strict';

define([
  './load',
  './utils'
], function(load, utils) {
  /** @constant {string} */
  var REVIEW_LOAD_URL = 'http://o0.github.io/assets/json/reviews.json';

  /** @constant {int} */
  var IMG_SIZE = 124;

  /** @constant {int} */
  var RATING_STAR = 30;

  /** @constant {int} */
  var PAGE_SIZE = 3;

  /** @constant {string} */
  var DEFAULT_FILTER = 'reviews-all';

  var reviewFilterBlock = document.querySelector('.reviews-filter');
  var reviewBlock = document.querySelector('.reviews-list');
  var reviewContainer = document.querySelector('.reviews');
  var templateElement = document.querySelector('template');
  var moreBtn = document.querySelector('.reviews-controls-more');
  var currentPage = 0;
  var elementToClone;

  /** @type {Array.<Object>} */
  var reviewsList = [];

  /** @type {Array.<Object>} */
  var filteredReviews = [];

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
  };

  /** @param {function(string)} res */
  var loadShow = function(res) {
    if (res === 'show') {
      reviewContainer.classList.add('reviews-list-loading');
      utils.setElementHidden(reviewFilterBlock, true);
    } else {
      reviewContainer.classList.remove('reviews-list-loading');
      utils.setElementHidden(reviewFilterBlock, false);
    }
  };

  /** @param {Array.<Object>} reviews
   * @param {int} page*/
  var renderReviews = function(reviews, page, replace) {
    if (replace) {
      reviewBlock.innerHTML = '';
    }

    var from = page * PAGE_SIZE;
    var to = from + PAGE_SIZE;

    reviews.slice(from, to).forEach(function(review) {
      getReviewElement(review, reviewBlock);
    });

    if (utils.isNextPageAvailable(reviews, page + 1, PAGE_SIZE)) {
      utils.setElementHidden(moreBtn, true);
    } else {
      utils.setElementHidden(moreBtn, false);
    }
  };

  /**
   * @param {Array.<Object>} hotels
   * @param {string} filter
   */
  var getFilteredReviews = function(reviews, filter) {
    var reviewsToFilter = reviews.slice(0);

    switch (filter) {
      case 'reviews-recent':
        reviewsToFilter = reviewsToFilter.filter(function(review) {
          return new Date().valueOf() - new Date(review.date).valueOf() <= 14 * 24 * 60 * 60 * 1000;
        });
        reviewsToFilter.sort(function(a, b) {
          return new Date(b.date).valueOf() - new Date(a.date).valueOf();
        });
        break;
      case 'reviews-good':
        reviewsToFilter = reviewsToFilter.filter(function(review) {
          return review.rating >= 3;
        });
        reviewsToFilter.sort(function(a, b) {
          return b.rating - a.rating;
        });
        break;
      case 'reviews-bad':
        reviewsToFilter = reviewsToFilter.filter(function(review) {
          return review.rating <= 2;
        });
        reviewsToFilter.sort(function(a, b) {
          return a.rating - b.rating;
        });
        break;
      case 'reviews-popular':
        reviewsToFilter.sort(function(a, b) {
          return b.review_usefulness - a.review_usefulness;
        });
        break;
    }
    return reviewsToFilter;
  };

  /** @param {string} filter */
  var setFilter = function(filter) {
    filteredReviews = getFilteredReviews(reviewsList, filter);
    currentPage = 0;
    renderReviews(filteredReviews, currentPage, true);
  };

  var setFiltrationEnabled = function() {
    reviewFilterBlock.addEventListener('click', function(evt) {
      if (evt.target.classList.contains('reviews-filter-item')) {
        setFilter(evt.target.getAttribute('for'));
      }
    });
  };


  var showMore = function() {
    moreBtn.addEventListener('click', function() {
      currentPage++;
      renderReviews(filteredReviews, currentPage);
    });
  };

  loadShow('show');
  load(REVIEW_LOAD_URL, function(loadedReview) {
    reviewsList = loadedReview;
    renderReviews(reviewsList, currentPage);
    loadShow('hide');
    setFiltrationEnabled(reviewsList);
    setFilter(DEFAULT_FILTER);
    showMore();
  }, function() {
    reviewContainer.classList.add('reviews-load-failure');
    loadShow('hide');
  });
});
