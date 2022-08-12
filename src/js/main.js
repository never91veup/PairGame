(() => {

  function generateArrayItems(size) {
    let arrayItems = [];
    let doubleSize = Math.pow(size, 2);

    for(let i = 0; i < doubleSize/2; i++) {
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

  
  // let btn = document.querySelector('.save');

  // btn.addEventListener('click', function() {
    // var text = parseInt(input.value);
  //   generateArrayItems(8);
  // });


  // function getValue(btn) {
  //   document.location = "menu.html";
  //   let input = document.querySelector('.input');
  //   let sizeValue = input.value;
  //   return sizeValue;
  // }

  // btn.addEventListener('click', getValue);


  // console.log(text)

  arrayItems = generateArrayItems(6);
  
  
  // создаем HTML карточки и выносим на поле
  function addItems(arrayItems) {
    let mainContainer = document.querySelector('.main__container');

    let columns = [];
    let rows = [];
    for(let j = 0; j < Math.sqrt(arrayItems.length); j++) {
        columns.push('1fr');
        rows.push('1fr');
    }
    let row = rows.join(' ');
    let col = columns.join(' ');
    
    mainContainer.style.gridTemplateColumns = col;
    mainContainer.style.gridTemplateRows = row;

    mainContainer.style.maxWidth = `${(rows.length * 100) + ((rows.length + 1) * 20)}px`;
    mainContainer.style.maxHeight = `${(rows.length * 100) + ((rows.length + 1) * 20)}px`;

    let template = document.getElementById('producttable');

    for(let i = 0; i < arrayItems.length; i++) {
      let clone = template.content.cloneNode(true);
      let container = clone.querySelector('.card__container');
      let image = clone.querySelector('.card__front');

      container.dataset.framework = `${arrayItems[i]}`;
      image.src = `../src/img/${arrayItems[i]}.svg`;
      mainContainer.appendChild(clone);
    }


  }

  addItems(arrayItems);

  // создаем эффект вращения и сравнение карт
  const cards = document.querySelectorAll('.card__container');

  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;

    checkForMatch();
  }

  function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    isMatch ? disableCards() : unflipCards();
  }

  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
  }

  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');

      resetBoard();
    }, 1000);

  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  cards.forEach(card => card.addEventListener('click', flipCard));


})();