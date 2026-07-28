// carousel-js.js
// Implements an auto-sliding, infinite loop carousel with arrow controls.
// When all slides fit, the carousel becomes static (no buttons, no auto‑slide).

class Carousel {
  constructor(element) {
    this.carousel = element;
    this.container = this.carousel.querySelector('.js-carousel-container');
    this.track = this.carousel.querySelector('.js-carousel-track');
    this.prevBtn = this.carousel.querySelector('.js-carousel-prev');
    this.nextBtn = this.carousel.querySelector('.js-carousel-next');

    if (!this.track || !this.container) return;

    // Store original slides
    this.originalSlides = Array.from(this.track.children);
    this.slideCount = this.originalSlides.length;
    if (this.slideCount === 0) return;

    // Configuration
    this.autoSlideInterval = 3000;
    this.transitionDuration = 300;
    this.currentIndex = 0;
    this.slideWidth = 0;
    this.isTransitioning = false;
    this.autoTimer = null;
    this.isInfiniteEnabled = false;
    this.visibleCount = 0;
    this.totalSlidesWithClones = 0;

    // Bind methods
    this.handlePrevClick = () => this.prevSlide();
    this.handleNextClick = () => this.nextSlide();
    this.handleTransitionEnd = this.onTransitionEnd.bind(this);
    this.handleResize = this.onWindowResize.bind(this);

    // Initial build
    this.buildCarousel();

    // Event listeners
    this.prevBtn.addEventListener('click', this.handlePrevClick);
    this.nextBtn.addEventListener('click', this.handleNextClick);
    this.track.addEventListener('transitionend', this.handleTransitionEnd);
    window.addEventListener('resize', this.handleResize);

    // Pause on hover
    this.carousel.addEventListener('mouseenter', () => this.stopAutoSlide());
    this.carousel.addEventListener('mouseleave', () => this.startAutoSlide());
  }

  // ----------------------------------------------------------------------
  //  Core: decide mode & build DOM
  // ----------------------------------------------------------------------
  buildCarousel() {
    // Reset track to original slides
    this.track.innerHTML = '';
    this.originalSlides.forEach(slide => {
      this.track.appendChild(slide.cloneNode(true));
    });

    // Measure
    this.recalculateSlideWidth();
    this.visibleCount = this.getVisibleCount();

    const allFit = this.slideCount <= this.visibleCount;

    if (allFit) {
      // STATIC MODE
      this.isInfiniteEnabled = false;
      this.currentIndex = 0;
      this.updateTransform(false);
      this.disableCarouselMode();
    } else {
      // INFINITE LOOP MODE
      this.isInfiniteEnabled = true;
      this.cloneSlidesForInfiniteLoop();
      this.recalculateSlideWidth();
      this.currentIndex = this.slideCount;
      this.updateTransform(false);
      this.enableCarouselMode();
      this.startAutoSlide();
    }
  }

  rebuildCarousel() {
    this.stopAutoSlide();
    this.isTransitioning = false;
    this.buildCarousel();
  }

  // ----------------------------------------------------------------------
  //  DOM helpers for infinite loop
  // ----------------------------------------------------------------------
  cloneSlidesForInfiniteLoop() {
    this.track.innerHTML = '';
    
    // Clone all slides (3 copies total: before + original + after)
    const clonesBefore = this.originalSlides.map(s => s.cloneNode(true));
    const clonesAfter = this.originalSlides.map(s => s.cloneNode(true));
    
    clonesBefore.forEach(clone => this.track.appendChild(clone));
    this.originalSlides.forEach(original => this.track.appendChild(original.cloneNode(true)));
    clonesAfter.forEach(clone => this.track.appendChild(clone));
    
    this.totalSlidesWithClones = this.track.children.length;
  }

  recalculateSlideWidth() {
    const firstSlide = this.track.querySelector('.carousel__slide');
    if (!firstSlide) return;
    
    // Get the actual width including margins
    const rect = firstSlide.getBoundingClientRect();
    const style = window.getComputedStyle(firstSlide);
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;
    
    // Get the gap from the track
    const trackStyle = window.getComputedStyle(this.track);
    const gap = parseFloat(trackStyle.gap) || 0;
    
    this.slideWidth = rect.width + marginLeft + marginRight + gap;
  }

  getVisibleCount() {
    if (!this.container || this.slideWidth === 0) return 0;
    const containerWidth = this.container.clientWidth;
    return Math.floor(containerWidth / this.slideWidth);
  }

  // ----------------------------------------------------------------------
  //  UI & mode switching
  // ----------------------------------------------------------------------
  disableCarouselMode() {
    this.prevBtn.style.display = 'none';
    this.nextBtn.style.display = 'none';
    this.stopAutoSlide();
    this.currentIndex = 0;
    this.updateTransform(false);
  }

  enableCarouselMode() {
    this.prevBtn.style.display = '';
    this.nextBtn.style.display = '';
    this.prevBtn.removeAttribute('disabled');
    this.nextBtn.removeAttribute('disabled');
  }

  // ----------------------------------------------------------------------
  //  Transform & sliding
  // ----------------------------------------------------------------------
  updateTransform(useTransition = true) {
    if (!this.track) return;
    
    const translateX = -this.currentIndex * this.slideWidth;
    
    if (useTransition) {
      this.track.style.transition = `transform ${this.transitionDuration}ms ease-out`;
    } else {
      this.track.style.transition = 'none';
    }
    
    this.track.style.transform = `translateX(${translateX}px)`;
  }

  goToSlide(index, useTransition = true) {
    if (!this.isInfiniteEnabled) return;
    if (this.isTransitioning || index === this.currentIndex) return;
    
    this.isTransitioning = true;
    this.currentIndex = index;
    this.updateTransform(useTransition);
  }

  nextSlide() {
    if (!this.isInfiniteEnabled || this.isTransitioning) return;
    this.goToSlide(this.currentIndex + 1, true);
    this.resetAutoTimer();
  }

  prevSlide() {
    if (!this.isInfiniteEnabled || this.isTransitioning) return;
    this.goToSlide(this.currentIndex - 1, true);
    this.resetAutoTimer();
  }

  // Infinite loop correction after transition ends
  onTransitionEnd() {
    if (!this.isInfiniteEnabled) {
      this.isTransitioning = false;
      return;
    }
    
    this.isTransitioning = false;

    const firstOriginalIdx = this.slideCount;
    const lastOriginalIdx = this.slideCount + this.slideCount - 1;

    if (this.currentIndex > lastOriginalIdx) {
      // Jump back to the beginning
      const newIndex = firstOriginalIdx + (this.currentIndex - lastOriginalIdx - 1);
      this.currentIndex = newIndex;
      this.updateTransform(false);
    } else if (this.currentIndex < firstOriginalIdx) {
      // Jump to the end
      const offset = firstOriginalIdx - this.currentIndex;
      const newIndex = lastOriginalIdx - (offset - 1);
      this.currentIndex = newIndex;
      this.updateTransform(false);
    }
  }

  // ----------------------------------------------------------------------
  //  Auto‑slide control
  // ----------------------------------------------------------------------
  startAutoSlide() {
    if (!this.isInfiniteEnabled) return;
    if (this.autoTimer) clearInterval(this.autoTimer);
    
    this.autoTimer = setInterval(() => {
      if (!this.isTransitioning && document.contains(this.carousel)) {
        this.nextSlide();
      }
    }, this.autoSlideInterval);
  }

  stopAutoSlide() {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
  }

  resetAutoTimer() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  // ----------------------------------------------------------------------
  //  Resize handling
  // ----------------------------------------------------------------------
  onWindowResize() {
    if (!this.container) return;
    
    // Debounce resize
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = setTimeout(() => {
      this.recalculateSlideWidth();
      const newVisibleCount = this.getVisibleCount();
      const nowAllFit = this.slideCount <= newVisibleCount;

      if (nowAllFit !== !this.isInfiniteEnabled) {
        // Mode changed → rebuild
        this.rebuildCarousel();
      } else if (this.isInfiniteEnabled) {
        // Same mode, just reposition
        this.currentIndex = this.slideCount;
        this.updateTransform(false);
        this.visibleCount = newVisibleCount;
      }
      
      this.resizeTimeout = null;
    }, 150);
  }

  // ----------------------------------------------------------------------
  //  Cleanup
  // ----------------------------------------------------------------------
  destroy() {
    this.stopAutoSlide();
    window.removeEventListener('resize', this.handleResize);
    this.prevBtn.removeEventListener('click', this.handlePrevClick);
    this.nextBtn.removeEventListener('click', this.handleNextClick);
    if (this.track) {
      this.track.removeEventListener('transitionend', this.handleTransitionEnd);
    }
  }
}

// ----------------------------------------------------------------------
//  Initialize all carousels on page load
// ----------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.js-carousel');
  carousels.forEach(carouselEl => {
    if (!carouselEl.carouselInstance) {
      carouselEl.carouselInstance = new Carousel(carouselEl);
    }
  });
});

// ----------------------------------------------------------------------
//  Continuous logos carousel – seamless infinite scroll
// ----------------------------------------------------------------------
(function initContinuousCarousel() {
  const carousel = document.getElementById('logoCarousel');
  if (!carousel) return;

  const track = document.getElementById('logoTrack');
  if (!track) return;

  const originalSlides = Array.from(track.children);
  if (originalSlides.length === 0) return;

  let allSlides = [];
  let originalSetWidth = 0;
  let translateX = 0;
  let animationId = null;
  let speed = 1.5;
  let isPaused = false;

  function buildLongTrack() {
    track.innerHTML = '';
    // Add three copies for seamless scrolling
    for (let i = 0; i < 3; i++) {
      originalSlides.forEach(slide => {
        track.appendChild(slide.cloneNode(true));
      });
    }
    allSlides = Array.from(track.children);
  }

  function getOriginalSetWidth() {
    let width = 0;
    for (let i = 0; i < originalSlides.length; i++) {
      const slide = allSlides[i];
      if (!slide) break;
      const style = window.getComputedStyle(slide);
      const marginLeft = parseFloat(style.marginLeft) || 0;
      const marginRight = parseFloat(style.marginRight) || 0;
      width += slide.offsetWidth + marginLeft + marginRight;
    }
    // Add gap if exists
    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.gap) || 0;
    width += gap * (originalSlides.length - 1);
    return width;
  }

  function scrollStep() {
    if (isPaused) {
      animationId = requestAnimationFrame(scrollStep);
      return;
    }
    
    if (!carousel || !track) return;

    translateX -= speed;
    track.style.transform = `translateX(${translateX}px)`;

    // Reset when we've scrolled past one full set
    if (Math.abs(translateX) >= originalSetWidth) {
      translateX += originalSetWidth;
      track.style.transition = 'none';
      track.style.transform = `translateX(${translateX}px)`;
      // Force reflow
      void track.offsetHeight;
      track.style.transition = 'transform 0.1s linear';
    }

    animationId = requestAnimationFrame(scrollStep);
  }

  function startScroll() {
    if (animationId) cancelAnimationFrame(animationId);
    isPaused = false;
    track.style.transition = 'transform 0.1s linear';
    animationId = requestAnimationFrame(scrollStep);
  }

  function stopScroll() {
    isPaused = true;
  }

  function onResize() {
    const wasPaused = isPaused;
    stopScroll();
    
    buildLongTrack();
    originalSetWidth = getOriginalSetWidth();
    translateX = 0;
    track.style.transition = 'none';
    track.style.transform = `translateX(0px)`;
    void track.offsetHeight;
    track.style.transition = 'transform 0.1s linear';
    
    if (!wasPaused) {
      startScroll();
    }
  }

  // Build initial track
  buildLongTrack();
  originalSetWidth = getOriginalSetWidth();
  track.style.transition = 'transform 0.1s linear';

  // Event listeners
  carousel.addEventListener('mouseenter', stopScroll);
  carousel.addEventListener('mouseleave', startScroll);
  window.addEventListener('resize', onResize);

  // Start the animation
  startScroll();

  // Cleanup
  window.cleanupContinuousCarousel = function() {
    stopScroll();
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    window.removeEventListener('resize', onResize);
    carousel.removeEventListener('mouseenter', stopScroll);
    carousel.removeEventListener('mouseleave', startScroll);
  };
})();