let state = 0;
let draws = 0;
let pairs = 0;
let trys = 0;
let timer = 0;
let ingame = 0;
let playedGames = Number(localStorage.getItem("playedGames"));
let wantedcards, wantedpairsCustom, wantedpairsRadio;
let color1, color2;
let revealedCard1, revealedCard2;
let cards = [];
//const cards = ["red", "red", "blue", "blue", "yellow", "yellow", "lime", "lime", "black", "black", "white", "white"];

function createCards() {
    wantedpairsCustom = document.getElementById("pairsCustom").value;
    wantedpairsRadio = document.querySelector("input[name=difficultySelector]:checked").value;
    if (wantedpairsCustom == 0) {
        wantedcards = wantedpairsRadio*2
    } else {
        wantedcards = wantedpairsCustom*2
    }
    var gameboard = document.getElementById("game-board");
    while (gameboard.firstChild) {
        gameboard.removeChild(gameboard.firstChild);
    }
    cards = [];
    for (let b = 0; b < wantedcards; b++) {
        const card = document.createElement("div");
        card.id = "card" + b;
        card.className = "card";
        card.addEventListener("click", function(){revealCard("card" + b)});
        document.getElementById("game-board").appendChild(card);
    }
    const pauseButton = document.getElementById("startButton");
    pauseButton.disabled = "true";
    pauseButton.style.opacity = 0.5;
    gameboard.scrollIntoView({block: "center", behavior: "instant"})
    pairs = 0;
    trys = 0;
    document.getElementById("tryCounter").innerHTML = "Versuche: " +trys;
    randomColorGenerator();
    shuffle();
    ingame = 1;
    timer = 0;
    startTimer();
}

function randomColorGenerator () {
    for (i = 0; i < wantedcards/2; i++) {
        let f = '#' + Math.floor(Math.random()*16777215).toString(16);
        cards.push(f, f);
    }
}

function shuffle() {
    for (let i = cards.length -1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        let k = cards[i];
        cards[i] = cards[j];
        cards[j] = k;
    }
    for (let a = 0; a < wantedcards; a++) {
        const currentCard = document.getElementById("card" + a);
        currentCard.dataset.color = cards[a];
    }
}

function revealCard(c) {
    console.log(ingame)
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
        trys = trys +1;
        document.getElementById("tryCounter").innerHTML = "Versuche: " +trys;
        setTimeout(
            resetDraws,
            1100
        )
        }
    }
}

function startTimer() {
    document.getElementById("timer").innerHTML = "Timer: " + timer + " Sekunden";
    if (ingame == 1) {
        timer = timer +1;
        setTimeout(startTimer, 1000)
    }
}

function removeCards () {
    revealedCard1.className = "matched";
    revealedCard2.className = "matched";
    pairs = pairs +1;
    if (pairs == wantedcards/2) {
        const pauseButton = document.getElementById("startButton");
        pauseButton.removeAttribute("disabled");
        pauseButton.style.opacity = 1;
        saveHighscore()
        ingame = 0;
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

function saveHighscore() {
    playedGames = playedGames +1;
    localStorage.setItem("playedGames", playedGames);
    localStorage.setItem("timeGame" +playedGames, timer);
    localStorage.setItem("trysGame" +playedGames, trys);
    localStorage.setItem("pairsGame" +playedGames, wantedcards/2);
    localStorage.setItem("entry" +playedGames, playedGames);
    loadScoreboard();
}

function loadScoreboard() {
    var scoreboardEntry = document.getElementsByClassName("scoreboardEntry");
    while (scoreboardEntry.firstChild) {
        scoreboardEntry.removeChild(scoreboardEntry.firstChild);
    }
    var gameboard = document.getElementById("scoreboard");
    while (scoreboard.firstChild) {
        scoreboard.removeChild(scoreboard.firstChild);
    }
    for (l = 1; l <= playedGames; l++) {
        const entry = document.createElement("div");
        entry.id = "scoreboardEntry" + l;
        entry.className = "scoreboardEntry";
        const entryNumber = document.createElement("div");
        entryNumber.id = "entryNumber" + l;
        entryNumber.className = "entryComponent";
        entryNumber.innerHTML = l + ".";
        const entryTime = document.createElement("div");
        entryTime.id = "entryTime" + l;
        entryTime.className = "entryComponent";
        entryTime.innerHTML = "Zeit: " + localStorage.getItem("timeGame" +l) + "s";
        const entryTrys = document.createElement("div");
        entryTrys.id = "entryTrys" + l;
        entryTrys.className = "entryComponent";
        entryTrys.innerHTML = "Versuche: " + localStorage.getItem("trysGame" +l);
        const entryPairs = document.createElement("div");
        entryPairs.id = "entryPairs" + l;
        entryPairs.className = "entryComponent";
        entryPairs.innerHTML = "Paare: " + localStorage.getItem("pairsGame" +l);
        document.getElementById("scoreboard").appendChild(entry);
        document.getElementById("scoreboardEntry" +l).appendChild(entryNumber);
        document.getElementById("scoreboardEntry" +l).appendChild(entryTime);
        document.getElementById("scoreboardEntry" +l).appendChild(entryTrys);
        document.getElementById("scoreboardEntry" +l).appendChild(entryPairs);
    }
}