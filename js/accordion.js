const items = document.querySelectorAll(".accordion-item");

items.forEach(item => {
  const btn = item.querySelector(".accordion-title");
  const content = item.querySelector(".accordion-content");
  const icon = item.querySelector(".accordion-icon");

  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");

    // close all
    items.forEach(i => {
      i.classList.remove("active");
      i.querySelector(".accordion-content").style.maxHeight = null;
      i.querySelector(".accordion-title").setAttribute("aria-expanded", "false");
      i.querySelector(".accordion-icon").textContent = "+";
    });

    // open clicked (if it wasn't open)
    if (!isOpen) {
      item.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
      btn.setAttribute("aria-expanded", "true");
      icon.textContent = "×";
    }
  });
});