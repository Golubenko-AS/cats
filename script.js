if (!document.cookie) {
  window.location.replace("auth.html");
}

const main = document.querySelector("main");
const infoBlock = document.querySelector(".info-block");
let catId = 0;

const setRate = function (n) {
  let fill = "<img src='img/cat-fill.svg' alt='^_^'>";
  let stroke = "<img src='img/cat-stroke.svg' alt='O_o'>";
  let rate = "",
    cnt = 10;
  for (let i = 0; i < cnt; i++) {
    rate += i < n ? fill : stroke;
  }
  return rate;
};

const setAge = function (n, w1, w2, w3) {
  if (n % 100 < 11 || n % 100 > 14) {
    if (n % 10 === 1) {
      return w1;
    } else if (n % 10 >= 2 && n % 10 <= 4) {
      return w2;
    } else {
      return w3;
    }
  } else {
    return w3;
  }
};

const showInfo = function (data) {
  catId = data.id;
  infoBlock.classList.add("active");
  infoBlock.innerHTML = `
      <div class="info-wrapper">
        <img class="info-img" src="${data.img_link}" alt="${data.name}">
        <div class="information">
            <h2>${data.name}</h2>
            <h3>${data.age} ${setAge(data.age, "год", "года", "лет")}</h3>
            <p>${data.description}</p>
        </div>
        <div class="info-close" onclick="closeInfo()"></div>
        <div class="delete-cat" onclick="deleteCat()""></div>
        <div class="info-update"></div>
      </div>
    `;
    const updateDiv = infoBlock.querySelector(".info-update");
    updateDiv.addEventListener("click", (e) => {
      infoUpdate(data)
    });
};

const closeInfo = function () {
  infoBlock.classList.remove("active");
};

const getItems = function (data) {
  const item = `
        <div class="card">
            <div class="card-img" style="background-image: url(${data.img_link})"></div>
            <h3>${data.name}</h3>
            <p class="rate">${setRate(data.rate)}</p>
        </div>
    `;
  main.innerHTML += item;
};

function getCats() {
  fetch("https://sb-cats.herokuapp.com/api/show")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then(({ data }) => {
      data.forEach((cat) => {
        getItems(cat);
      });
      const cards = document.querySelectorAll(".card-img");
      for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", function (e) {
          showInfo(data[i]);
          updateDiv = data[i];
        });
      }
      if (!localStorage.getItem("cats")) {
        localStorage.setItem("cats", JSON.stringify(data));
      }
    });
};
getCats();

const resetCat = function () {
  localStorage.clear("cats");
  fetch("https://sb-cats.herokuapp.com/api/show")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then(({ data }) => {
      let newLocalStorege = [];
      data.forEach((cat) => {
        newLocalStorege.push(cat);
      });
      main.innerHTML = "";
      newLocalStorege.forEach((cat) => {
        getItems(cat);
      });
      const cards = document.querySelectorAll(".card-img");
      for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", function (e) {
          showInfo(data[i]);
        });
      }
      localStorage.setItem("cats", JSON.stringify(newLocalStorege));
    });
};

function deleteCat() {
  if (window.confirm("Если удалить этого котика, то больше никто и никогда его не увидит. Вы правда этого хотите?")) {
    fetch(`https://sb-cats.herokuapp.com/api/delete/${catId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      })
      .then((data) => {
        if (data.message === "ok") {
          resetCat();
        }
      });
      closeInfo();
  }
};

const addCat = function () {
  infoBlock.classList.add("active");
  infoBlock.innerHTML = `
      <form class="catForm">
        <input type="text" placeholder="id" name="id" id="id">
        <input type="text" placeholder="Имя" name="name" id="name">
        <input type="text" placeholder="Возраст" name="age" id="age">
        <input type="text" placeholder="Ссылка картинки" name="img_link" id="img_link">
        <input type="text" placeholder="Описание котика" name="description" id="description" class="description">
        <input type="text" placeholder="Рейтинг от 0 до 10" name="rate" id="rate">
        <button type="submit" class="addCatBtn">Добавить</button>
        <div class="info-close closeAddForm" onclick="closeInfo()"></div>
      </form>
    `;
  const catForm = document.querySelector(".catForm");

  function formValues(catForm) {
    const values = {}
    const inputs = catForm.querySelectorAll('input');
    inputs.forEach(input => {
      values[input.name] = input.value;
    })
    return values;
}

    catForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let newCat = formValues(catForm)
    fetch("https://sb-cats.herokuapp.com/api/add", {
      method: "POST",
      body: JSON.stringify(newCat),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      })
      .then((data) => {
        if (data.message === "ok") {
          resetCat();
          closeInfo();
        } else {
          alert("Возможно котик с таким id уже создан");
        }
      });
  });
};

const infoUpdate = function (data) {
  console.log(`Надо изменить информацию о котике id="${data.id}"`);
  infoBlock.classList.add("active");
  infoBlock.innerHTML = `
      <form class="catForm">
        <input type="text" placeholder="Имя" name="name" id="name" value="${data.name}">
        <input type="text" placeholder="Возраст" name="age" id="age" value="${data.age}">
        <input type="text" placeholder="Ссылка картинки" name="img_link" id="img_link" value="${data.img_link}">
        <input type="text" placeholder="Описание котика" name="description" id="description" class="description" value="${data.description}">
        <input type="text" placeholder="Рейтинг от 0 до 10" name="rate" id="rate" value="${data.rate}">
        <button type="submit" class="updateCatBtn">Изменить</button>
        <div class="info-close" onclick="closeInfo()"></div>
      </form>
    `;

  const catForm = document.querySelector(".catForm");

  function formValues(catForm) {
    const values = {}
    const inputs = catForm.querySelectorAll('input');
    inputs.forEach(input => {
      values[input.name] = input.value;
    })
    return values;
}

    catForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let newCat = formValues(catForm)
    fetch(`https://sb-cats.herokuapp.com/api/update/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(newCat),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      })
      .then((data) => {
        if (data.message === "ok") {
          resetCat();
          closeInfo();
        }
      });
  });
};