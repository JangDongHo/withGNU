import { checkLoggedIn } from "./middleware";
const scrapBtn = document.getElementById("scrapBtn");
const scrapIcon = document.getElementById("scrapIcon");

const placeScrap = async () => {
  const login = await checkLoggedIn();
  if (!login) {
    window.location = `/login`;
  } else {
    const placeId = scrapBtn.dataset.placeid;
    const response = await fetch(`/api/places/${placeId}/scrap`, {
      method: "POST",
    });
    const { msg } = await response.json();
    if (msg === "addScrap") {
      scrapBtn.classList.add("clicked");
      scrapIcon.classList.replace("fa-regular", "fa-solid");
    } else if (msg === "cancelScrap") {
      scrapBtn.classList.remove("clicked");
      scrapIcon.classList.replace("fa-solid", "fa-regular");
    }
  }
};

const addScrapBtnEvent = () => {
  scrapBtn.addEventListener("click", placeScrap);
};

addScrapBtnEvent();
