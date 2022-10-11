let elbody = findElement("#tbody");
let table = findElement(".table");
let template = findElement("#template").content;
const formSelect = findElement(".form-select");
let btnReset = findElement("#btn-reset");
let filterBtn = findElement("#filter-btn");
let searchInput = findElement(".input");
let modal = findElement(".modal");
let modalClose = findElement(".btn-close");
let spinnerBorder = findElement(".spinner-border");
let spinnerLoadingPage = findElement(".spinner-grow");
const wrapper = findElement(".wrapper");
let countBookMark = findElement(".count-text");

function wrapperLoading() {
  spinnerLoadingPage.style.display = "none";
  wrapper.classList.add("wrapper-active");
}

setTimeout(wrapperLoading, 3000);

let intervalId;

function modalShow() {
  modal.classList.add("modal-active");
}
intervalId = setTimeout(modalShow, 10000);

if (localStorage.getItem("modalDetected")) {
  clearInterval(intervalId);
}

modalClose.onclick = function () {
  window.localStorage.setItem("modalDetected", true);
  modal.classList.remove("modal-active");
};

let currencies = localStorage.getItem("currency");

let arrayHelpSorting = [];

let arrayBookMark = [];

let getItemLocalStorageBookMark = localStorage.getItem("bookmark");

if (getItemLocalStorageBookMark) {
  arrayBookMark = JSON.parse(getItemLocalStorageBookMark);
}

function countClassName(btn, item) {
  arrayBookMark.forEach((element) => {
    if (element.CcyNm_UZ === item) {
      btn.className = "count-btn-red";
    }
  });
}

if(arrayBookMark.length >= 1){
  countBookMark.textContent = arrayBookMark.length;
}

let currencyArray = currencies ? JSON.parse(currencies) : [];

async function fetchSend() {
  try {
    spinnerBorder.classList.add("spinner-border-active");
    let fetched = await fetch("https://pressa-exem.herokuapp.com/api-49");
    let json = await fetched.json();
    spinnerBorder.classList.remove("spinner-border-active");
    let data = json.data;
    arrayHelpSorting = json.data;
    data.sort((a, b) => {
      return a.id - b.id;
    });
    window.localStorage.setItem("currency", JSON.stringify(data));
  } catch (error) {
    console.loge(error);
    console.log("No internet Connection");
  }
}
fetchSend();

function renderingElementsPage(array) {
  elbody.innerHTML = "";
  array.forEach((element, index) => {
    let templateClone = template.cloneNode(true);
    let currencyCode = findElement("#currency-id", templateClone);
    let currencyName = findElement(".currency-name", templateClone);
    let currencyWord = findElement(".currency-word", templateClone);
    let currencyUpdating = findElement(".currency-updating", templateClone);
    let currencyPrice = findElement(".currency-price", templateClone);
    let currencyNomer = findElement(".currency-nomer", templateClone);
    let btnBookMart = findElement("#btn-bookmart", templateClone);
    btnBookMart.dataset.id = element.id;
    btnBookMart.dataset.type = element.CcyNm_UZ;
    countClassName(btnBookMart, element.CcyNm_UZ);

    if (arrayBookMark.length >= 1) {
      arrayBookMark.forEach((item) => {
        if (item.CcyNm_UZ === element.CcyNm_UZ) {
          element.id = item.id;
        }
      });
    }

    btnBookMart.onclick = function (event) {
      let value = Number(event.target.dataset.id);
      if (value === element.id) {
        element.id++;
        event.target.className = "count-btn-red";
        arrayBookMark.push(element);
        countBookMark.textContent = arrayBookMark.length;
        window.localStorage.setItem("bookmark", JSON.stringify(arrayBookMark));
      } else {
        element.id--;
        arrayBookMark.forEach((item) => {
          if (item.CcyNm_UZ === event.target.dataset.type) {
            let index = (item) => item.CcyNm_UZ === event.target.dataset.type;
            let count = arrayBookMark.findIndex(index);
            arrayBookMark.splice(count, 1);
            countBookMark.textContent = arrayBookMark.length;
          }
        });
        event.target.className = "count-btn-green";
        window.localStorage.setItem("bookmark", JSON.stringify(arrayBookMark));
      }
    };
    currencyCode.innerHTML = element.Code;
    currencyName.innerHTML = element.CcyNm_UZ;
    currencyWord.innerHTML = element.Ccy;
    currencyUpdating.innerHTML = element.Date;
    currencyPrice.innerHTML = element.Rate;
    currencyNomer.innerHTML = ++index;
    elbody.appendChild(templateClone);
  });
}
renderingElementsPage(currencyArray);

formSelect.addEventListener("change", (event) => {
  let targetValue = event.target.value;
  if (targetValue === "Default") {
    arrayHelpSorting.sort((a, b) => {
      return a.id - b.id;
    });
    renderingElementsPage(arrayHelpSorting);
  }
  if (targetValue === "Expansive") {
    arrayHelpSorting.sort((a, b) => {
      return b.Rate - a.Rate;
    });
    renderingElementsPage(arrayHelpSorting);
  }
  if (targetValue === "Cheap") {
    arrayHelpSorting.sort((a, b) => {
      return a.Rate - b.Rate;
    });
    renderingElementsPage(arrayHelpSorting);
  }
});

btnReset.onclick = function () {
  renderingElementsPage(currencyArray);
  filterBtn.style.display = "block";
  searchInput.style.display = "none";
  searchInput.value = "";
  formSelect.value = "Open this select menu";
};
filterBtn.onclick = function () {
  this.style.display = "none";
  searchInput.style.display = "block";
};

searchInput.addEventListener("input", (e) => {
  let valueInput = e.target.value;
  let arrayRate = [];
  arrayHelpSorting.forEach((element) => {
    element.Rate = Number(element.Rate);
    if (element.Rate >= valueInput) {
      arrayRate.push(element);
    }
  });
  renderingElementsPage(arrayRate);
});
