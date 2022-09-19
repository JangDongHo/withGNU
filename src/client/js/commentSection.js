import { checkLoggedIn } from "./middleware";

const modalBtn1 = document.getElementById("reviewModalBtn1");
const modalBtn2 = document.getElementById("reviewModalBtn2");
const modal = document.getElementById("reviewModal");
const textarea = document.querySelector("textarea");
const closeModalBtn = document.getElementById("closeReviewModalBtn");
const reviewUploadBtn = document.getElementById("reviewUploadBtn");
const reviewModalOverlay = document.getElementById("reviewModalOverlay");
const reviewForm = document.querySelector("#reviewForm");

// 이미지 미리보기
const commentImgs = document.querySelectorAll(".commentImg");
const previewImages = document.querySelectorAll(".previewImage");

const editBtns = document.querySelectorAll("#reviewEditBtn");
const deleteBtns = document.querySelectorAll("#reviewDeleteBtn");
const scrapBtn = document.getElementById("scrapBtn");

let isSubmitted = false;

const preventDoubleSubmit = (event) => {
  if (!isSubmitted) {
    isSubmitted = true;
    reviewUploadBtn.disabled = true;
    reviewUploadBtn.style.background = "white";
    reviewUploadBtn.style.color = "#adadad";
    reviewUploadBtn.innerText = "등록중...";
  }
};

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

const previewImage = (event) => {
  const { target } = event;
  const images = Array.from(target.parentNode.children);
  const index = Math.floor(images.indexOf(target) / 2);
  console.log(images, index);
  let labelImage = images[index * 2];
  labelImage.style.display = "none";
  if (index < 3) {
    labelImage = images[index * 2 + 2];
    labelImage.style.display = "inline-block";
  }
  const previewImage = document.getElementById(`previewImage${index + 1}`);
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.setAttribute("src", e.target.result);
  };
  reader.readAsDataURL(event.target.files[0]);
};

const closeModal = () => {
  previewImages.forEach((image) => {
    image.removeAttribute("src");
  });
  // 이미지 업로드 버튼 초기화
  const uploadImageBtn = modal.querySelector(".upload-wrapper");
  const labelImage = uploadImageBtn.querySelectorAll("label");
  for (let i = 0; i < 4; i++) {
    const image = labelImage[i];
    if (i === 0) image.style.display = "inline-block";
    else image.style.display = "none";
  }
  commentImgs.forEach((img) => {
    img.value = "";
  });

  document.body.style.overflow = "visible";
  modal.classList.add("hidden");
};

const openModal = async () => {
  const login = await checkLoggedIn();
  if (!login) {
    window.location = `/login`;
  } else {
    commentImgs.forEach((img) => {
      img.addEventListener("change", previewImage);
    });
    document.body.style.overflow = "hidden";
    modal.classList.remove("hidden");
    textarea.addEventListener("keyup", handleSubmitBtn);
    reviewForm.addEventListener("submit", preventDoubleSubmit);
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
    const newReviewRating = modal.querySelector(
      'input[name="commentRating"]:checked'
    ).value;
    const reviewText = document.getElementById("inputBox").value;
    await fetch(`/api/comments/${reviewId}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviewText, oldReviewRating, newReviewRating }),
    });
    isSubmitted = false;
    const placeId = scrapBtn.dataset.placeid;
    window.location = `/places/${placeId}`;
  };
  const closeEditModal = () => {
    // 미리보기 초기화
    previewImages.forEach((image) => {
      image.removeAttribute("src");
    });
    reviewUploadBtn.setAttribute("type", "submit");
    textarea.value = "";
    reviewUploadBtn.removeEventListener("click", editComment);
    const uploadImageBtn = modal.querySelector(".upload-wrapper");
    uploadImageBtn.classList.remove("hidden");
    document.body.style.overflow = "visible";
    modal.classList.add("hidden");
  };
  const showPreviewImages = () => {
    const images = review.childNodes[2].childNodes;
    images.forEach((img, index) => {
      const image = img.src;
      const previewImage = document.getElementById(`previewImage${++index}`);
      previewImage.setAttribute("src", image);
    });
  };
  const review = event.path[2];
  showPreviewImages();
  const text = review.querySelector(".placeReview__content > span").innerText;
  const reviewId = review.dataset.reviewid;
  const oldReviewRating =
    review.querySelector(".rating-wrapper").dataset.rating;
  textarea.value = text;
  document.body.style.overflow = "hidden";
  modal.classList.remove("hidden");
  const uploadImageBtn = modal.querySelector(".upload-wrapper");
  uploadImageBtn.classList.add("hidden");
  reviewUploadBtn.setAttribute("type", "button");
  reviewUploadBtn.addEventListener("click", editComment);
  textarea.addEventListener("keyup", handleSubmitBtn);
  closeModalBtn.addEventListener("click", closeEditModal);
  reviewModalOverlay.addEventListener("click", closeEditModal);
};

const handleDeleteBtn = async (event) => {
  const review = event.path[2];
  const reviewID = review.dataset.reviewid;
  const reviewRating = review.querySelector(".rating-wrapper").dataset.rating;
  let imagePaths = [];
  try {
    const images = review.querySelectorAll(".placeReview__images > img");
    images.forEach((image) => {
      const imageSrc = image.getAttribute("src");
      imagePaths.push(
        imageSrc.charAt(0) === "/" ? imageSrc.substr(1) : imageSrc
      );
    });
  } catch (error) {}
  review.remove();
  await fetch(`/api/comments/${reviewID}/edit`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reviewRating, imagePaths }),
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
