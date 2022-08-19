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
};

const handleTextarea = (event) => {
  textarea.addEventListener("keyup", handleSubmitBtn);
};

addRateBtnEvent();*/
