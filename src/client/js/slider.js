const { next } = require("cheerio/lib/api/traversing");

const slides = document.querySelector(".slides");
const slide = document.querySelectorAll(".slides li");
const prevBtn = document.querySelector(".slidePrev");
const nextBtn = document.querySelector(".slideNext");
const slideWidth = 100;
const slideMargin = 10;
let currentIdx = 0;
let slideCount = slide.length;

const moveSlide = (num) => {
  slides.style.left = -num * 110 + "px";
};

const handleNextBtn = () => {
  if (currentIdx < slideCount - 3) {
    moveSlide(++currentIdx);
  } else {
    moveSlide(0);
    currentIdx = 0;
  }
};

const handlePrevBtn = () => {
  if (currentIdx > 0) {
    moveSlide(--currentIdx);
  } else {
    moveSlide(slideCount - 3);
    currentIdx = slideCount - 3;
  }
};

slides.style.width =
  (slideWidth + slideMargin) * slideCount - slideMargin + "px";

nextBtn.addEventListener("click", handleNextBtn);
prevBtn.addEventListener("click", handlePrevBtn);
