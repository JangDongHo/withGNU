const modalBtn1 = document.getElementById("reviewModalBtn1");
const modalBtn2 = document.getElementById("reviewModalBtn2");
const modal = document.getElementById("reviewModal");
const textarea = document.querySelector("textarea");
const closeModalBtn = document.getElementById("closeReviewModalBtn");
const reviewUploadBtn = document.getElementById("reviewUploadBtn");
const reviewModalOverlay = document.getElementById("reviewModalOverlay");

const handleSubmitBtn = () => {
  if (textarea.value === "") {
    reviewUploadBtn.disabled = true;
    reviewUploadBtn.style.background = "white";
    reviewUploadBtn.style.color = "#adadad";
  } else {
    reviewUploadBtn.disabled = false;
    reviewUploadBtn.style.background = "#fe6b0fcc";
    reviewUploadBtn.style.color = "white";
  }
};

const closeModal = () => {
  document.body.style.overflow = "visible";
  modal.classList.add("hidden");
};

const openModal = () => {
  document.body.style.overflow = "hidden";
  modal.classList.remove("hidden");
  textarea.addEventListener("keyup", handleSubmitBtn);
  closeModalBtn.addEventListener("click", closeModal);
  reviewModalOverlay.addEventListener("click", closeModal);
};

const addModalBtnEvent = () => {
  modalBtn1.addEventListener("click", openModal);
  modalBtn2.addEventListener("click", openModal);
};

addModalBtnEvent();

/*const rateBtns = document.querySelectorAll(".rateBtn");
const clickArea = document.getElementById("clickArea");
const textarea = clickArea.querySelector("textarea");
const commentSubmitBtn = document.getElementById("commentSubmitBtn");

const addRateBtnEvent = () => {
  rateBtns.forEach((btn) => {
    btn.addEventListener("click", handleRateBtn);
  });
};

const handleRateBtn = (event) => {
  clickArea.style.display = "block";
  textarea.focus();
  handleTextarea();
};

const handleTextarea = (event) => {
  textarea.addEventListener("keyup", handleSubmitBtn);
};

const handleSubmitBtn = (event) => {
  if (textarea.value === "") {
    commentSubmitBtn.disabled = true;
    commentSubmitBtn.style.background = "#adadad";
    commentSubmitBtn.style.color = "#e3e3e5";
  } else {
    commentSubmitBtn.disabled = false;
    commentSubmitBtn.style.background = "#fe6b0fcc";
    commentSubmitBtn.style.color = "white";
  }
};*/
