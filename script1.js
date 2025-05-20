let state = 0;
let draws = 0;
let pairs = 0;
let color1, color2;
let revealedCard1, revealedCard2;
const cards = ["red", "red", "blue", "blue", "yellow", "yellow", "lime", "lime", "black", "black", "white", "white"]

function createCards() {
    var gameboard = document.getElementById("game-board");
    while (gameboard.firstChild) {
        gameboard.removeChild(gameboard.firstChild);
    }
    for (let b = 0; b < 12; b++) {
        const card = document.createElement("div");
        card.id = "card" + b;
        card.className = "card";
        card.addEventListener("click", function(){revealCard("card" + b)});
        document.getElementById("game-board").appendChild(card);
    }
    shuffle();
    const pauseButton = document.getElementById("startButton");
    pauseButton.disabled = "true";
    pauseButton.style.opacity = 0.5;
    pairs = 0;
}

function shuffle() {
    for (let i = cards.length -1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        let k = cards[i];
        cards[i] = cards[j];
        cards[j] = k;
    }
    for (let a = 0; a < 12; a++) {
        const currentCard = document.getElementById("card" + a);
        currentCard.dataset.color = cards[a];
    }
}

function revealCard(c) {
    if (draws == 0) {
        const card = document.getElementById(c);
        const color = card.getAttribute("data-color");
        card.style.setProperty("--real-color", color);
        card.className = "flipped";
        if (state == 0) {
            color1 = color;
            revealedCard1 = card;
            state = 1;
        } else if (revealedCard1 == card) {

        } else {
            draws = 1;
            color2 = color;
            revealedCard2 = card;
            if (color1 === color2) {
                console.log(revealedCard1 + revealedCard2)
                setTimeout(
                    removeCards,
                    1000
                )
            } else {
                setTimeout(
                    returnCards,
                    1000
                )
            }
        setTimeout(
            resetDraws,
            1100
        )
        }
    }
}

function removeCards () {
    revealedCard1.className = "matched";
    revealedCard2.className = "matched";
    pairs = pairs +1;
    console.log(pairs)
    if (pairs == 6) {
        const pauseButton = document.getElementById("startButton");
        pauseButton.removeAttribute("disabled");
        pauseButton.style.opacity = 1;
    }
}

function returnCards () {
    revealedCard1.className = "card";
    revealedCard2.className = "card";
}

function resetDraws() {
    state = 0;
    draws = 0;
}