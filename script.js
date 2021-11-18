'use strict';

let cardsArray = [0, 0, 0, 0, 0, 0, 0, 0];
let pairCards = [0, 0];
let counter = 0;
let scoreStep = 1;
let lastCard;

const score = document.querySelector('#score-num');
const bestScore = document.querySelector('#score2-num');
const cards = document.querySelectorAll('img');
const message = document.querySelector('.message');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closeModalBtn = document.querySelector('.close-modal');
const newGameBtn = document.querySelector('.btn-new');

const removeElement = (arr, value) => {
  return arr.filter(function (ele) {
    return ele !== value;
  });
};

const placeCards = () => {
  let tempArr = [0, 1, 2, 3, 4, 5, 6, 7];
  for (let i = 1; i <= 4; i++) {
    for (let j = 0; j < 2; j++) {
      const randElement = tempArr[Math.floor(Math.random() * tempArr.length)];
      cardsArray[randElement] = i;
      tempArr = removeElement(tempArr, randElement);
    }
  }
};

const checkRoundEnd = () => {
  for (const card of cards) {
    if (card.getAttribute('src') === 'reverse.png') {
      return false;
    }
  }

  return true;
};

const showModal = () => {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const startNextRound = () => {
  for (const card of cards) {
    card.src = 'reverse.png';
    card.style.pointerEvents = 'auto';
  }
  score.textContent = '0';
  placeCards();
  counter = 0;
  scoreStep = 1;
};

placeCards();

for (let i = 0; i < 8; i++) {
  cards[i].addEventListener('click', function () {
    switch (counter) {
      case 0:
        cards[i].src = `aces-${cardsArray[i]}.png`;
        lastCard = i;
        pairCards[0] = cardsArray[i];
        counter = 1;
        cards[i].style.pointerEvents = 'none';
        break;
      case 1:
        cards[i].src = `aces-${cardsArray[i]}.png`;
        cards[i].style.pointerEvents = 'none';
        pairCards[1] = cardsArray[i];
        if (pairCards[0] === pairCards[1]) {
          cards[i].style.pointerEvents = 'none';
          cards[lastCard].style.pointerEvents = 'none';
          score.textContent = Number(score.textContent) + scoreStep;
          if (checkRoundEnd()) {
            if (
              Number(score.textContent) < Number(bestScore.textContent) ||
              Number(bestScore.textContent) === 0
            ) {
              bestScore.textContent = score.textContent;
              message.textContent = `Your new best score is ${bestScore.textContent}. Starting next round...`;
            } else {
              message.textContent = `Your round score is ${score.textContent}. Starting next round...`;
            }
            showModal();
          }
          scoreStep = 1;
          counter = 0;
          pairCards = [0, 0];
        } else {
          for (const card of cards) {
            if (card.getAttribute('src') === 'reverse.png') {
              card.style.pointerEvents = 'none';
            }
          }
          scoreStep++;
          counter = 0;
          pairCards = [0, 0];
          setTimeout(() => {
            cards[lastCard].src = 'reverse.png';
            cards[i].src = 'reverse.png';
            for (const card of cards) {
              if (card.getAttribute('src') === 'reverse.png') {
                card.style.pointerEvents = 'auto';
              }
            }
          }, 1000);
        }
        break;
    }
  });
}

closeModalBtn.addEventListener('click', function () {
  startNextRound();
  closeModal();
});

newGameBtn.addEventListener('click', function () {
  startNextRound();
  bestScore.textContent = '0';
});

document.addEventListener('keydown', function (e) {
  if (
    e.key === 'Escape' &&
    !modal.classList.contains('hidden') &&
    !overlay.classList.contains('hidden')
  ) {
    startNextRound();
    closeModal();
  }
});
