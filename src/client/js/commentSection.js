import fetch from "node-fetch";

const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
  event.preventDefault();
  const rating = document.getElementById("commentRating").value;
  const text = document.querySelector("textarea").value;
  const fileUrl = document.getElementById("commentImg").value;
  console.log(fileUrl);
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
