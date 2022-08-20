const headerImages = document.querySelectorAll("#headerImageBtn");
const commentImages = document.querySelectorAll("#commentImageBtn");
const image = document.getElementById("image");
const modal = document.getElementById("imageModal");
const closeModalBtn = document.getElementById("closeImageModalBtn");
const modaloverlay = document.getElementById("imageModalOverlay");

const imageScale = (images, index) => {
  image.setAttribute("src", images[index]);
};

const closeModal = () => {
  document.body.style.overflow = "visible";
  modal.classList.add("hidden");
};

const openImageModal = (event) => {
  const { target } = event;
  const images = Array.from(target.parentNode.children);
  const index = images.indexOf(target);
  const imagesPath = images.map((image) => image.getAttribute("src"));
  imageScale(imagesPath, index);
  document.body.style.overflow = "hidden";
  modal.classList.remove("hidden");
  closeModalBtn.addEventListener("click", closeModal);
  modaloverlay.addEventListener("click", closeModal);
};

const addImageBtnEvent = () => {
  headerImages.forEach((img) => {
    img.addEventListener("click", openImageModal);
  });
  commentImages.forEach((img) => {
    img.addEventListener("click", openImageModal);
  });
};

addImageBtnEvent();
