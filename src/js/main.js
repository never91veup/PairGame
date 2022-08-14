(() => {
  function initCards() {
    // создаем эффект вращения и сравнение карт
    const cards = document.querySelectorAll(".card__container");

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let count = 0;

    function flipCard() {
      if (lockBoard) return;
      if (this === firstCard) return;

      this.classList.add("flip");

      if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
      }

      secondCard = this;

      checkForMatch();
    }

    function checkForMatch() {
      let isMatch = firstCard.dataset.number === secondCard.dataset.number;
      isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
      firstCard.removeEventListener("click", flipCard);
      secondCard.removeEventListener("click", flipCard);

      count += 2;

      if (count === cards.length) {
        let restart = document.querySelector(".background");
        restart.style.display = "flex";
      }

      resetBoard();
    }

    function unflipCards() {
      lockBoard = true;

      setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");

        resetBoard();
      }, 1000);
    }

    function resetBoard() {
      [hasFlippedCard, lockBoard] = [false, false];
      [firstCard, secondCard] = [null, null];
    }

    cards.forEach((card) => card.addEventListener("click", flipCard));
  }

  function generateArrayItems(size) {
    let arrayItems = [];
    let doubleSize = Math.pow(size, 2);

    for (let i = 0; i < doubleSize / 2; i++) {
      elem = ((i % 8) + 1).toString();
      arrayItems.push(elem, elem);
    }

    shuffle(arrayItems);

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    return arrayItems;
  }

  // создаем HTML карточки и выносим на поле
  function addItems(arrayItems) {
    let mainContainer = document.querySelector(".main__container");
    mainContainer.innerHTML = "";

    let columns = [];
    let rows = [];
    for (let j = 0; j < Math.sqrt(arrayItems.length); j++) {
      columns.push("1fr");
      rows.push("1fr");
    }
    let row = rows.join(" ");
    let col = columns.join(" ");

    mainContainer.style.gridTemplateColumns = col;
    mainContainer.style.gridTemplateRows = row;

    mainContainer.style.maxWidth = `${
      rows.length * 100 + (rows.length + 1) * 20
    }px`;
    mainContainer.style.maxHeight = `${
      rows.length * 100 + (rows.length + 1) * 20
    }px`;


    let template = document.getElementById("producttable");

    for (let i = 0; i < arrayItems.length; i++) {
      let clone = template.content.cloneNode(true);
      let container = clone.querySelector(".card__container");
      if(Math.sqrt(arrayItems.length) == 8)  {
        container.style.width = '80px';
        container.style.height = '80px';
      }
      else if(Math.sqrt(arrayItems.length) == 10) {
        container.style.width = '70px';
        container.style.height = '70px';
      }
      let image = clone.querySelector(".card__front");

      container.dataset.number = `${arrayItems[i]}`;
      image.src = `src/img/${arrayItems[i]}.svg`;
      mainContainer.appendChild(clone);
    }
  }

  let start = document.querySelector(".start");
  let restart = document.querySelector(".restart");
  let menuBack = document.querySelector('.menu__back');
  let endOfTimer = false;

  menuBack.addEventListener("click", restartGame);
  start.addEventListener("click", startGame);
  restart.addEventListener("click", restartGame);



  function startGame() {
    endOfTimer = false;
    let timerInput = document.getElementById('time');
    let timerShow = document.getElementById('timer');
    timerShow.style.display = 'block';
    let timeMinut = parseInt(timerInput.value) * 60;

    let input = document.querySelector(".range");
    let size = input.value;
    let menu = document.querySelector(".container");
    menu.style.display = "none";
    let menuBack = document.querySelector('.menu__back')
    menuBack.style.display = 'block';
    let main = document.querySelector(".main__container");
    main.style.display = "grid";

    arrayItems = generateArrayItems(size);

    addItems(arrayItems);

    initCards();

    timer = setInterval(function () {
      let restart = document.querySelector(".background");
      let seconds = timeMinut%60; // Получаем секунды
      let minutes = timeMinut/60%60;  // Получаем минуты
      let hour = timeMinut/60/60%60; // Получаем часы
      // Условие если время закончилось то...
      if (timeMinut <= 0 || endOfTimer) {
          // Таймер удаляется
          clearInterval(timer);
          timerShow.innerHTML = '';
          timerShow.style.display = 'none';
          // Выводит сообщение что время закончилось
          if(timeMinut <= 0) {
            restart.style.display = "flex";
          }
      } else { // Иначе
          // Создаём строку с выводом времени
          let strTimer = `${Math.trunc(minutes)}:${seconds}`;
          // Выводим строку в блок для показа таймера
          timerShow.innerHTML = strTimer;
      }
      --timeMinut; // Уменьшаем таймер
    }, 1000);
  }

  function restartGame() {
    // let timerShow = document.getElementById('timer');
    // timerShow.style.display = 'none';
    endOfTimer = true;

    let mainContainer = document.querySelector(".main__container");
    let background = document.querySelector(".background");
    let menu = document.querySelector(".container");
    mainContainer.style.display = "none";
    background.style.display = "none";
    menu.style.display = "flex";
    let input = document.querySelector(".range");
    input.value = 4;
    let menuBack = document.querySelector('.menu__back')
    menuBack.style.display = 'none';
  }

})();
