function createCards() {
    for (let b = 0; b < 12; b++) {
        const card = document.createElement("div");
        card.id = "card" + b;
        card.className = "card";
        card.addEventListener("click", function(){revealCard("card" + b)});
        document.getElementById("game-board").appendChild(card);
    }
    shuffle();
    const removeButton = document.getElementById("startButton");
    removeButton.remove();
}

const cards = ["red", "red", "blue", "blue", "yellow", "yellow", "lime", "lime", "black", "black", "white", "white"]
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

let state = 0;
let color1, color2;
let revealedCard1, revealedCard2;
function revealCard(c) {
    const card = document.getElementById(c);
    const color = card.getAttribute("data-color");
    card.style.setProperty("--real-color", color);
    card.className = "flipped";
    if (state == 0) {
        color1 = color;
        revealedCard1 = card;
        state = 1;
    } else {
        color2 = color;
        revealedCard2 = card;
        if (color1 === color2) {
            setTimeout(
                revealedCard1.className = "matched",
                revealedCard2.className = "matched",
                state = 0,
                1000
            )
        } else {
            setTimeout(
                revealedCard1.className = "card",
                revealedCard2.className = "card",
                state = 0,
                1000
            )
        }
    }
}