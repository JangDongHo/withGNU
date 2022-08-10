const rates = document.querySelector(".info__comment__rates");
const rateBtns = document.querySelectorAll("#rateBtn");

const addRateBtnEvent = () => {
  rateBtns.forEach((btn) => {
    btn.addEventListener("click", handleRateBtn);
  });
};

const handleRateBtn = (event) => {
  /*
  const {
    target: {
      parentElement: {
        dataset: { rate },
      },
    },
  } = event;
  rates.dataset.rate = rate;
  */
};

addRateBtnEvent();
