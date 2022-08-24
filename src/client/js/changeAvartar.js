const changeAvatarBtn = document.getElementById("avartarImage");

const changeAvartar = (event) => {
  const image = event.target;
  const reader = new FileReader();
  reader.onload = (event) => {
    const previewImage = document.getElementById("previewImage");
    previewImage.setAttribute("src", event.target.result);
  };

  reader.readAsDataURL(image.files[0]);
};

const addchangeAvatarBtnEvent = () => {
  changeAvatarBtn.addEventListener("change", changeAvartar);
};

addchangeAvatarBtnEvent();
