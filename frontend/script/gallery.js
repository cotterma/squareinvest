let currentSlide = 0;

function showPreviousSlide() {
  const slides = document.querySelectorAll('.slide');
  slides[currentSlide].style.display = 'none';
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  slides[currentSlide].style.display = 'block';
}

function showNextSlide() {
  const slides = document.querySelectorAll('.slide');
  slides[currentSlide].style.display = 'none';
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].style.display = 'block';
}

function resetSlide(){
  currentSlide = 0;
}

export {showPreviousSlide, showNextSlide, resetSlide};
