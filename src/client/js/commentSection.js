import { checkLoggedIn } from "./middleware";

const modalBtn1 = document.getElementById("reviewModalBtn1");
const modalBtn2 = document.getElementById("reviewModalBtn2");
const modal = document.getElementById("reviewModal");
const textarea = document.querySelector("textarea");
const closeModalBtn = document.getElementById("closeReviewModalBtn");
const reviewUploadBtn = document.getElementById("reviewUploadBtn");
const reviewModalOverlay = document.getElementById("reviewModalOverlay");

const editBtns = document.querySelectorAll("#reviewEditBtn");
const deleteBtns = document.querySelectorAll("#reviewDeleteBtn");

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

const addEditBtnEvent = () => {
  editBtns.forEach((btn) => {
    btn.addEventListener("click", handleEditBtn);
    btn.preventDefault;
  });
};

const handleEditBtn = (event) => {
  const editComment = async () => {
    const reviewRating = modal.querySelector(
      'input[name="commentRating"]:checked'
    ).value;
    await fetch(`/api/comments/${commentId}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviewText, reviewRating }),
    });
  };
  const review = event.path[2];
  const reviewText = review.querySelector(
    ".placeReview__content > span"
  ).innerText;
  const commentId = review.dataset.reviewid;
  textarea.value = reviewText;
  document.body.style.overflow = "hidden";
  modal.classList.remove("hidden");
  reviewUploadBtn.setAttribute("type", "button");
  reviewUploadBtn.addEventListener("click", editComment);
  textarea.addEventListener("keyup", handleSubmitBtn);
  closeModalBtn.addEventListener("click", closeModal);
  reviewModalOverlay.addEventListener("click", closeModal);
};

const handleDeleteBtn = async (event) => {
  const review = event.path[2];
  const reviewID = review.dataset.reviewid;
  review.remove();
  await fetch(`/api/comments/${reviewID}/edit`, {
    method: "DELETE",
  });
};

const addDeleteBtnEvent = () => {
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", handleDeleteBtn);
  });
};

addModalBtnEvent();
addEditBtnEvent();
addDeleteBtnEvent();
