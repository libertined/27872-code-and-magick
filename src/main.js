'use strict';

require([
  './gallery',
  './form',
  './game',
  './reviewlist'
], function(gallery) {
  var pictureBlock = document.querySelector('.photogallery');
  var picturesCollect = pictureBlock.querySelectorAll('.photogallery-image img');
  var picturesImg = [];

  for(var i = 0; i < picturesCollect.length; i++) {
    picturesImg.push(picturesCollect[i]);
    picturesCollect[i].setAttribute('data-number', i);
  }

  gallery.savePictures(picturesImg);

  for(var j = 0; j < picturesCollect.length; j++) {
    picturesCollect[j].addEventListener('click', function(evt) {
      evt.stopPropagation();
      gallery.showGallery(evt.target.getAttribute('data-number'));
    });
  }

});
