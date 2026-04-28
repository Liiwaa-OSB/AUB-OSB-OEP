// carousel.js
// Implements an auto-sliding, infinite loop carousel with arrow controls

class Carousel {
  constructor(element) {
    this.carousel = element;
    this.container = this.carousel.querySelector('.js-carousel-container');
    this.track = this.carousel.querySelector('.js-carousel-track');
    this.prevBtn = this.carousel.querySelector('.js-carousel-prev');
    this.nextBtn = this.carousel.querySelector('.js-carousel-next');

    if (!this.track || !this.container) return;

    // Original slides (before cloning)
    this.originalSlides = Array.from(this.track.children);
    this.slideCount = this.originalSlides.length;
    if (this.slideCount === 0) return;

    // Configuration
    this.autoSlideInterval = 3000; // 3 seconds
    this.transitionDuration = 300; // ms (must match CSS transition)
    this.currentIndex = 0;
    this.slideWidth = 0;
    this.isTransitioning = false;
    this.autoTimer = null;
    this.resizeObserver = null;

    // DOM modifications for infinite loop
    this.cloneSlidesForInfiniteLoop();
    this.recalculateSlideWidth();

    // Set initial transform to show first original slide
    this.currentIndex = this.slideCount; // start with first original slide after clones
    this.updateTransform(false); // no transition on init

    // Bind event listeners
    this.handlePrevClick = this.prevSlide.bind(this);
    this.handleNextClick = this.nextSlide.bind(this);
    this.handleTransitionEnd = this.onTransitionEnd.bind(this);
    this.handleResize = this.onWindowResize.bind(this);

    this.prevBtn.addEventListener('click', this.handlePrevClick);
    this.nextBtn.addEventListener('click', this.handleNextClick);
    this.track.addEventListener('transitionend', this.handleTransitionEnd);
    window.addEventListener('resize', this.handleResize);

    // Enable arrow buttons (infinite loop means no disabled state)
    this.prevBtn.removeAttribute('disabled');
    this.nextBtn.removeAttribute('disabled');

    // Start auto sliding
    this.startAutoSlide();

    // Optional: pause auto-slide on hover
    this.carousel.addEventListener('mouseenter', () => this.stopAutoSlide());
    this.carousel.addEventListener('mouseleave', () => this.startAutoSlide());
  }

  // Clone slides for infinite loop (prepend clone group, append clone group)
  cloneSlidesForInfiniteLoop() {
    // Clear track but keep original slides array references
    this.track.innerHTML = '';

    // Clone all original slides
    const clonesBefore = this.originalSlides.map(slide => slide.cloneNode(true));
    const clonesAfter = this.originalSlides.map(slide => slide.cloneNode(true));

    // Append clonesBefore (prepend group), original, clonesAfter (append group)
    clonesBefore.forEach(clone => this.track.appendChild(clone));
    this.originalSlides.forEach(original => this.track.appendChild(original));
    clonesAfter.forEach(clone => this.track.appendChild(clone));

    // Update slides collection
    this.allSlides = Array.from(this.track.children);
    this.totalSlidesWithClones = this.allSlides.length;
    // Original slides start at index = this.slideCount (clonesBefore length)
  }

  // Calculate accurate slide width including margins (for precise sliding)
  recalculateSlideWidth() {
    if (this.allSlides.length === 0) return;
    const slide = this.allSlides[0];
    const style = window.getComputedStyle(slide);
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;
    const width = slide.offsetWidth;
    this.slideWidth = width + marginLeft + marginRight;
  }

  // Apply transform to track based on currentIndex
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

  // Go to specific slide index (without infinite loop correction)
  goToSlide(index, useTransition = true) {
    if (this.isTransitioning || index === this.currentIndex) return;
    this.isTransitioning = true;
    this.currentIndex = index;
    this.updateTransform(useTransition);
  }

  // Next slide (auto or arrow)
  nextSlide() {
    if (this.isTransitioning) return;
    this.goToSlide(this.currentIndex + 1, true);
    this.resetAutoTimer();
  }

  // Previous slide
  prevSlide() {
    if (this.isTransitioning) return;
    this.goToSlide(this.currentIndex - 1, true);
    this.resetAutoTimer();
  }

  // Called after transition ends: correct index if out of original bounds (infinite loop magic)
  onTransitionEnd() {
    this.isTransitioning = false;

    // Define original block boundaries: first original slide index = slideCount, last original slide index = slideCount + slideCount - 1
    const firstOriginalIdx = this.slideCount;
    const lastOriginalIdx = this.slideCount + this.slideCount - 1;

    // If we moved past the last original slide (to clonesAfter region)
    if (this.currentIndex > lastOriginalIdx) {
      // Jump back to first original slide (no transition)
      const newIndex = firstOriginalIdx + (this.currentIndex - lastOriginalIdx - 1);
      this.currentIndex = newIndex;
      this.updateTransform(false);
    }
    // If we moved before the first original slide (into clonesBefore region)
    else if (this.currentIndex < firstOriginalIdx) {
      // Jump to last original slide region
      const offset = firstOriginalIdx - this.currentIndex;
      const newIndex = lastOriginalIdx - (offset - 1);
      this.currentIndex = newIndex;
      this.updateTransform(false);
    }
  }

  // Auto slide control
  startAutoSlide() {
    if (this.autoTimer) clearInterval(this.autoTimer);
    this.autoTimer = setInterval(() => {
      // Only auto-slide if not transitioning and carousel is visible (basic perf)
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
    // Reset auto-slide timer on manual interaction (optional but standard UX)
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  // Recalculate on window resize
  onWindowResize() {
    this.recalculateSlideWidth();
    // Reposition to current slide without transition jump
    this.updateTransform(false);
  }

  // Cleanup to prevent memory leaks
  destroy() {
    this.stopAutoSlide();
    window.removeEventListener('resize', this.handleResize);
    this.prevBtn.removeEventListener('click', this.handlePrevClick);
    this.nextBtn.removeEventListener('click', this.handleNextClick);
    if (this.track) {
      this.track.removeEventListener('transitionend', this.handleTransitionEnd);
    }
    this.carousel.removeEventListener('mouseenter', () => this.stopAutoSlide());
    this.carousel.removeEventListener('mouseleave', () => this.startAutoSlide());
  }
}

// Initialize all carousels on page load
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.js-carousel');
  carousels.forEach(carouselEl => {
    // Avoid duplicate initialization
    if (!carouselEl.carouselInstance) {
      carouselEl.carouselInstance = new Carousel(carouselEl);
    }
  });
});