// Fade in effect
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      console.log(entry);
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        // entry.target.classList.remove("show");
      }
    });
  });

  const hiddenElements = document.querySelectorAll(".hidden-animation");
  hiddenElements.forEach((el) => observer.observe(el));
});

// Carousel
let currentIndex = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const totalSlides = slides.length;

function showSlide(index) {
  if (index >= totalSlides) {
    currentIndex = 0;
  } else if (index < 0) {
    currentIndex = totalSlides - 1;
  } else {
    currentIndex = index;
  }

  const offset = -currentIndex * 100;
  document.querySelector(
    ".carousel"
  ).style.transform = `translateX(${offset}%)`;

  dots.forEach((dot) => dot.classList.remove("active"));
  dots[currentIndex].classList.add("active");
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => showSlide(index));
});

let startX;
const carousel = document.querySelector(".carousel");

carousel.addEventListener("mousedown", (event) => {
  startX = event.clientX;
  carousel.addEventListener("mousemove", onDrag);
  carousel.addEventListener("mouseup", onStop);
});

carousel.addEventListener("touchstart", (event) => {
  startX = event.touches[0].clientX;
  carousel.addEventListener("touchmove", onDrag);
  carousel.addEventListener("touchend", onStop);
});

function onDrag(event) {
  let x = event.type === "mousemove" ? event.clientX : event.touches[0].clientX;
  let move = startX - x;
  if (move > 50) {
    showSlide(currentIndex + 1);
    onStop();
  } else if (move < -50) {
    showSlide(currentIndex - 1);
    onStop();
  }
}

function onStop() {
  carousel.removeEventListener("mousemove", onDrag);
  carousel.removeEventListener("mouseup", onStop);
  carousel.removeEventListener("touchmove", onDrag);
  carousel.removeEventListener("touchend", onStop);
}

showSlide(currentIndex);
