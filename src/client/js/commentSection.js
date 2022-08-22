import { checkLoggedIn } from "./middleware";

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

const openModal = async () => {
  const login = await checkLoggedIn();
  if (!login) {
    window.location = `/login`;
  } else {
    document.body.style.overflow = "hidden";
    modal.classList.remove("hidden");
    textarea.addEventListener("keyup", handleSubmitBtn);
    closeModalBtn.addEventListener("click", closeModal);
    reviewModalOverlay.addEventListener("click", closeModal);
  }
};

const addModalBtnEvent = () => {
  modalBtn1.addEventListener("click", openModal);
  modalBtn2.addEventListener("click", openModal);
};

addModalBtnEvent();
