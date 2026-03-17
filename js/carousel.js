(function () {
  // Initialize all carousels on the page
  const carousels = document.querySelectorAll(".js-carousel");

  carousels.forEach((carousel) => {
    const container = carousel.querySelector(".js-carousel-container");
    const track = carousel.querySelector(".js-carousel-track");
    const prevBtn = carousel.querySelector(".js-carousel-prev");
    const nextBtn = carousel.querySelector(".js-carousel-next");

    if (!container || !track || !prevBtn || !nextBtn) return;

    // gap value (as in CSS)
    const gap = 1.5 * 16; // 1.5rem = 24px

    // function to get slide width (including gap)
    function getSlideWidth() {
      const firstSlide = track.querySelector(".carousel__slide");
      if (!firstSlide) return 0;
      return firstSlide.getBoundingClientRect().width + gap;
    }

    // update disabled state of buttons based on scroll position
    function updateButtons() {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      // tolerance 1px for rounding
      prevBtn.disabled = scrollLeft < 5;
      nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth - 5;
    }

    // scroll to next slide (smooth)
    function scrollNext() {
      const slideWidth = getSlideWidth();
      if (slideWidth === 0) return;
      container.scrollBy({ left: slideWidth, behavior: "smooth" });
    }

    // scroll to previous slide
    function scrollPrev() {
      const slideWidth = getSlideWidth();
      if (slideWidth === 0) return;
      container.scrollBy({ left: -slideWidth, behavior: "smooth" });
    }

    // event listeners for buttons
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      scrollNext();
    });

    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      scrollPrev();
    });

    // listen to scroll events to update button states
    container.addEventListener("scroll", () => {
      updateButtons();
    });

    // also update on resize (debounced)
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateButtons();
      }, 100);
    });

    // initial update after images might load
    setTimeout(updateButtons, 100);
    // also update after fonts / layout
    window.addEventListener("load", updateButtons);
  });
})();
