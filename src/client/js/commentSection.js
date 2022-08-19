const modalBtn = document.getElementById("reviewModalBtn");
const modal = document.querySelector(".reviewModal");
const textarea = document.querySelector("textarea");
const closeModalBtn = document.getElementById("closeReviewModalBtn");
const reviewUploadBtn = document.getElementById("reviewUploadBtn");

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
  modal.classList.add("hidden");
};

const openModal = () => {
  modal.classList.remove("hidden");
  closeModalBtn.addEventListener("click", closeModal);
  textarea.addEventListener("keyup", handleSubmitBtn);
};

const addModalBtnEvent = () => {
  modalBtn.addEventListener("click", openModal);
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
