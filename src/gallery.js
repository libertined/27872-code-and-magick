'use strict';

define(['./utils'], function(utils) {
  var Gallery = function() {
    var self = this;

    this.element = document.querySelector('.overlay-gallery');

    this.nextPictute = this.element.querySelector('.overlay-gallery-control-right');
    this.prevPictute = this.element.querySelector('.overlay-gallery-control-left');
    this.closeElement = this.element.querySelector('.overlay-gallery-close');
    this.preview = this.element.querySelector('.overlay-gallery-preview');
    this.curPictureNumber = this.element.querySelector('.preview-number-current');
    this.totalPictureNumber = this.element.querySelector('.preview-number-total');


    /** @type {Array.<string>} */
    this.galleryPictures = [];


    /** @type {number} */
    this.activePicture = 0;

    /**
     * @param {int} index
     */
    this.navigateVisible = function(index) {
      var maxIndex = self.galleryPictures.length - 1;
      if(index > 0) {
        utils.setElementHidden(self.prevPictute, false);
      } else {
        utils.setElementHidden(self.prevPictute, true);
      }

      if(index < maxIndex) {
        utils.setElementHidden(self.nextPictute, false);
      } else {
        utils.setElementHidden(self.nextPictute, true);
      }
    };

    /**
     * @param {int} picture
     */
    this.showPicture = function(picture) {
      self.activePicture = picture;
      var curPhoto = self.preview.querySelector('img');
      self.curPictureNumber.innerHTML = +self.activePicture + 1;
      self.navigateVisible(picture);

      if(curPhoto) {
        curPhoto.remove();
      }
      var pictureElement = new Image();
      self.preview.appendChild(pictureElement);
      pictureElement.src = self.galleryPictures[ picture ].src;
    };

    this.showNext = function() {
      var nextIndex = +self.activePicture + 1;
      if(nextIndex <= self.galleryPictures.length - 1) {
        self.showPicture(nextIndex);
      }
    };

    this.showPrev = function() {
      var prevIndex = +self.activePicture - 1;
      if(prevIndex >= 0) {
        self.showPicture(prevIndex);
      }
    };

    this.hideGallery = function() {
      utils.setElementHidden(self.element, true);

      document.removeEventListener('keydown', self._onDocumentKeyDown);
      self.closeElement.removeEventListener('click', self._onCloseClick);
    };

    /**
     * @param {KeyboardEvent} evt
     */
    this._onDocumentKeyDown = function(evt) {
      if (utils.isDeactivationEvent(evt)) {
        evt.preventDefault();
        self.hideGallery();
      }
    };

    /**
     * @param {KeyboardEvent} evt
     */
    this._onCloseClick = function() {
      self.hideGallery();
    };

    /**
     * @param {int} startShow
     */
    this.showGallery = function(startShow) {
      self.showPicture(startShow);
      self.totalPictureNumber.innerHTML = self.galleryPictures.length;
      utils.setElementHidden(self.element, false);

      self.nextPictute.addEventListener('click', self.showNext);
      self.prevPictute.addEventListener('click', self.showPrev);

      document.addEventListener('keydown', self._onDocumentKeyDown);
      self.closeElement.addEventListener('click', self._onCloseClick);

    };

    /**
     * @param {Array.<Object>} pictures
     */
    this.savePictures = function(pictures) {
      if (pictures !== self.galleryPictures) {
        self.galleryPictures = pictures;
      }
    };
  };

  return new Gallery();
});
