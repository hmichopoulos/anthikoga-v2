/* === Hamburger Toggle === */
document.addEventListener('DOMContentLoaded', function () {
  var hamburger = document.querySelector('.hamburger');
  var menu = document.querySelector('.nav-menu');
  if (hamburger && menu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      menu.classList.toggle('open');
    });
  }

  /* === Tab Switching === */
  document.querySelectorAll('[role="tablist"]').forEach(function (tablist) {
    var tabs = tablist.querySelectorAll('[role="tab"]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var panelId = tab.getAttribute('aria-controls');
        // Pause any playing videos in the current panel
        tabs.forEach(function (t) {
          var p = document.getElementById(t.getAttribute('aria-controls'));
          if (p) {
            var video = p.querySelector('video');
            if (video) video.pause();
            p.classList.remove('active');
          }
          t.setAttribute('aria-selected', 'false');
        });
        // Activate clicked tab
        tab.setAttribute('aria-selected', 'true');
        var panel = document.getElementById(panelId);
        if (panel) panel.classList.add('active');
      });
    });
  });

  /* === Gallery Lightbox === */
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  var lbImg = lightbox.querySelector('.lightbox-main img');
  var lbStrip = lightbox.querySelector('.lightbox-strip');
  var lbClose = lightbox.querySelector('.lightbox-close');
  var lbPrev = lightbox.querySelector('.lightbox-prev');
  var lbNext = lightbox.querySelector('.lightbox-next');
  var currentImages = [];
  var currentIndex = 0;

  function openLightbox(images, index) {
    currentImages = images;
    currentIndex = index;
    showImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    buildStrip();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showImage() {
    if (currentImages.length === 0) return;
    lbImg.src = currentImages[currentIndex];
    // Update strip active state
    var stripImgs = lbStrip.querySelectorAll('img');
    stripImgs.forEach(function (img, i) {
      img.classList.toggle('active', i === currentIndex);
    });
    // Scroll active thumb into view
    var activeThumb = lbStrip.querySelector('img.active');
    if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  function buildStrip() {
    lbStrip.innerHTML = '';
    currentImages.forEach(function (src, i) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = 'Thumbnail ' + (i + 1);
      if (i === currentIndex) img.classList.add('active');
      img.addEventListener('click', function () {
        currentIndex = i;
        showImage();
      });
      lbStrip.appendChild(img);
    });
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', function () {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    showImage();
  });
  lbNext.addEventListener('click', function () {
    currentIndex = (currentIndex + 1) % currentImages.length;
    showImage();
  });

  // Close on overlay click
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-main')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length; showImage(); }
    if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % currentImages.length; showImage(); }
  });

  // Attach click handlers to all gallery thumbs
  document.querySelectorAll('.gallery-grid').forEach(function (grid) {
    var thumbs = grid.querySelectorAll('.thumb');
    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener('click', function () {
        // Collect all full-size image paths from this grid
        var images = [];
        grid.querySelectorAll('.thumb').forEach(function (t) {
          images.push(t.getAttribute('data-full'));
        });
        openLightbox(images, i);
      });
    });
  });
});
