'use strict';

define(['./utils'], function(utils) {
  var Gallery = function() {
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

    this.isPhoto = this.isPhoto.bind(this);

    window.addEventListener('hashchange', this.isPhoto);
  };

  /**
   * @param {Array.<Object>} pictures
   */
  Gallery.prototype.savePictures = function(pictures) {
    if (pictures !== this.galleryPictures) {
      this.galleryPictures = pictures;
    }
  };

  /**
   * @param {int} index
   */
  Gallery.prototype.navigateVisible = function(index) {
    var maxIndex = this.galleryPictures.length - 1;
    if(index > 0) {
      utils.setElementHidden(this.prevPictute, false);
    } else {
      utils.setElementHidden(this.prevPictute, true);
    }

    if(index < maxIndex) {
      utils.setElementHidden(this.nextPictute, false);
    } else {
      utils.setElementHidden(this.nextPictute, true);
    }
  };

  /**
   * @param {int} picture
   */
  Gallery.prototype.showPicture = function(picture) {
    if(isNaN(picture)) {
      var self = this;
      this.galleryPictures.forEach(function(item, i) {
        if(item.src.indexOf(picture) !== -1) {
          self.activePicture = i;
        }
      });
      self = null;
    } else {
      this.activePicture = picture;
    }

    var curPhoto = this.preview.querySelector('img');
    this.curPictureNumber.innerHTML = +this.activePicture + 1;
    this.navigateVisible(this.activePicture);

    if(curPhoto) {
      curPhoto.remove();
    }
    var pictureElement = new Image();
    this.preview.appendChild(pictureElement);
    pictureElement.src = this.galleryPictures[ this.activePicture ].src;
  };

  Gallery.prototype.showNext = function() {
    var nextIndex = +this.activePicture + 1;
    if(nextIndex <= this.galleryPictures.length - 1) {
      var picturSrc = this.galleryPictures[ nextIndex ].src.replace(location.origin, '');
      location.hash = 'photo' + picturSrc;
    }
  };

  Gallery.prototype.showPrev = function() {
    var prevIndex = +this.activePicture - 1;
    if(prevIndex >= 0) {
      var picturSrc = this.galleryPictures[ prevIndex ].src.replace(location.origin, '');
      location.hash = 'photo' + picturSrc;
    }
  };

  Gallery.prototype.hideGallery = function() {
    location.hash = '';
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    this.closeElement.removeEventListener('click', this._onCloseClick);
    utils.setElementHidden(this.element, true);
  };

  /**
   * @param {KeyboardEvent} evt
   */
  Gallery.prototype._onDocumentKeyDown = function(evt) {
    if (utils.isDeactivationEvent(evt)) {
      evt.preventDefault();
      this.hideGallery();
    }
  };

  /**
   * @param {KeyboardEvent} evt
   */
  Gallery.prototype._onCloseClick = function() {
    this.hideGallery();
  };

  /**
   * @param {int} startShow
   */
  Gallery.prototype.showGallery = function(startShow) {
    this.showPicture(startShow);
    this.totalPictureNumber.innerHTML = this.galleryPictures.length;
    utils.setElementHidden(this.element, false);

    this.showNext = this.showNext.bind(this);
    this.showPrev = this.showPrev.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);

    this.nextPictute.addEventListener('click', this.showNext);
    this.prevPictute.addEventListener('click', this.showPrev);

    document.addEventListener('keydown', this._onDocumentKeyDown);
    this.closeElement.addEventListener('click', this._onCloseClick);

  };

  Gallery.prototype.isPhoto = function() {
    var curTag = location.hash.match(/#photo\/(\S+)/);
    if(curTag && curTag[1]) {
      this.showGallery(curTag[1]);
    }
  };

  return Gallery;
});
