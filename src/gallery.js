'use strict';

define(['./utils'], function(utils) {
  var galleryContainer = document.querySelector('.overlay-gallery');
  var nextPictute = document.querySelector('.overlay-gallery-control-right');
  var prevPictute = document.querySelector('.overlay-gallery-control-left');
  var closeElement = galleryContainer.querySelector('.overlay-gallery-close');
  var preview = galleryContainer.querySelector('.overlay-gallery-preview');
  var curPictureNumber = document.querySelector('.preview-number-current');
  var totalPictureNumber = document.querySelector('.preview-number-total');


  /** @type {Array.<string>} */
  var galleryPictures = [];


  /** @type {number} */
  var activePicture = 0;

  /**
   * @param {int} index
   */
  var navigateVisible = function(index) {
    var maxIndex = galleryPictures.length - 1;
    if(index > 0) {
      utils.setElementHidden(prevPictute, false);
    } else {
      utils.setElementHidden(prevPictute, true);
    }

    if(index < maxIndex) {
      utils.setElementHidden(nextPictute, false);
    } else {
      utils.setElementHidden(nextPictute, true);
    }
  };

  /**
   * @param {int} picture
   */
  var showPicture = function(picture) {
    activePicture = picture;
    var curPhoto = preview.querySelector('img');
    curPictureNumber.innerHTML = +activePicture + 1;
    navigateVisible(picture);

    if(curPhoto) {
      curPhoto.remove();
    }
    var pictureElement = new Image();
    preview.appendChild(pictureElement);
    pictureElement.src = galleryPictures[ picture ].src;
  };

  var showNext = function() {
    var nextIndex = +activePicture + 1;
    if(nextIndex <= galleryPictures.length - 1) {
      showPicture(nextIndex);
    }
  };

  var showPrev = function() {
    var prevIndex = +activePicture - 1;
    if(prevIndex >= 0) {
      showPicture(prevIndex);
    }
  };

  var hideGallery = function() {
    utils.setElementHidden(galleryContainer, true);

    document.removeEventListener('keydown', _onDocumentKeyDown);
    closeElement.removeEventListener('click', _onCloseClick);
  };

  /**
   * @param {KeyboardEvent} evt
   */
  var _onDocumentKeyDown = function(evt) {
    if (utils.isDeactivationEvent(evt)) {
      evt.preventDefault();
      hideGallery();
    }
  };

  /**
   * @param {KeyboardEvent} evt
   */
  var _onCloseClick = function() {
    hideGallery();
  };

  return {
    /**
     * @param {int} startShow
     */
    showGallery: function(startShow) {
      showPicture(startShow);
      totalPictureNumber.innerHTML = galleryPictures.length;
      utils.setElementHidden(galleryContainer, false);

      nextPictute.addEventListener('click', showNext);
      prevPictute.addEventListener('click', showPrev);

      document.addEventListener('keydown', _onDocumentKeyDown);
      closeElement.addEventListener('click', _onCloseClick);

    },

    /**
     * @param {Array.<Object>} pictures
     */
    savePictures: function(pictures) {
      if (pictures !== galleryPictures) {
        galleryPictures = pictures;
      }
    }
  };
});
