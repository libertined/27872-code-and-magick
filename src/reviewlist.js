'use strict';

define([
  './load',
  './utils',
  './review'
], function(load, utils, Review) {
  /** @constant {string} */
  var REVIEW_LOAD_URL = 'http://o0.github.io/assets/json/reviews.json';

  /** @constant {int} */
  var PAGE_SIZE = 3;

  /** @constant {string} */
  var DEFAULT_FILTER = 'reviews-all';

  var reviewFilterBlock = document.querySelector('.reviews-filter');
  var reviewBlock = document.querySelector('.reviews-list');
  var reviewContainer = document.querySelector('.reviews');
  var moreBtn = document.querySelector('.reviews-controls-more');
  var currentPage = 0;

  /** @type {Array.<Object>} */
  var reviewsList = [];

  /** @type {Array.<Object>} */
  var filteredReviews = [];

  /**
   * Массив отрисованных объектов отзывов
   * @type {Array.<Review>}
   */
  var renderedReviews = [];

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
      renderedReviews.forEach(function(review) {
        review.remove();
      });

      renderedReviews = [];
    }

    var from = page * PAGE_SIZE;
    var to = from + PAGE_SIZE;

    var container = document.createDocumentFragment();

    reviews.slice(from, to).forEach(function(review) {
      renderedReviews.push(new Review(review, container));
    });

    reviewBlock.appendChild(container);

    if (utils.isNextPageAvailable(reviews, page + 1, PAGE_SIZE)) {
      utils.setElementHidden(moreBtn, false);
    } else {
      utils.setElementHidden(moreBtn, true);
    }
  };

  /**
   * @param {Array.<Object>} reviews
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
    localStorage.setItem('filter', filter);
    return reviewsToFilter;
  };

  /** @param {string} filter */
  var setFilter = function(filter) {
    reviewFilterBlock.querySelector('#' + filter).checked = true;
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
    renderReviews(reviewsList, currentPage, true);
    loadShow('hide');
    setFiltrationEnabled(reviewsList);
    if(localStorage.getItem('filter')) {
      DEFAULT_FILTER = localStorage.getItem('filter');
    }
    setFilter(DEFAULT_FILTER);
    showMore();
  }, function() {
    reviewContainer.classList.add('reviews-load-failure');
    loadShow('hide');
  });
});
