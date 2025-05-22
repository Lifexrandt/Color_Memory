const CARD_CLASS = "card";
const FLIPPED_CLASS = "flipped";
const MATCHED_CLASS = "matched";
const START_BUTTON = document.getElementById("startButton");
const GAMEBOARD = document.getElementById("game-board");
const FLIP_DELAY_MS = 1000;

let gameState = {
    playedGamesCounter: Number(localStorage.getItem("playedGamesCounter")),
    firstCardFlipped: false,
    canClick: true,
    pairsFound: 0,
    isPlaying: false,
    totalPairsToFind: 0,
    selectedPairsCustomInput: 0,
    selectedPairsRadioInput: 0,
    currentTries: 0,
    currentTime: 0,
    firstClickedCard: 0,
    secondClickedCard: 0,
    firstClickedCardColor: 0,
    secondClickedCardColor: 0,
    cardColorPairs: [],
}


function initiateGameRound() {
    disableStartButton();
    getSelectedPairs ();
    clearGameboard();
    generateCards();
    gameState.cardColorPairs = [];
    GAMEBOARD.scrollIntoView({block: "center", behavior: "instant"})
    gameState.pairsFound = 0;
    gameState.currentTries = 0;
    gameState.isPlaying = true;
    gameState.currentTime = 0;
    document.getElementById("tryCounter").innerHTML = "Versuche: " +gameState.currentTries;
    randomColorGenerator();
    shuffle();
    startTimer();
}

function disableStartButton() {
    START_BUTTON.disabled = "true";
    START_BUTTON.style.opacity = 0.5;
}

function clearGameboard() {
    while (GAMEBOARD.firstChild) {
        GAMEBOARD.removeChild(GAMEBOARD.firstChild);
    }
}

function generateCards() {
    for (let b = 0; b < gameState.totalPairsToFind*2; b++) {
        const CARD = document.createElement("div");
        CARD.id = "card" + b;
        CARD.className = CARD_CLASS;
        CARD.addEventListener("click", function(){revealCard("card" + b)});
        document.getElementById("game-board").appendChild(CARD);
    }
}

function getSelectedPairs() {
    gameState.selectedPairsCustomInput = document.getElementById("pairsCustom").value;
    gameState.selectedPairsRadioInput = document.querySelector("input[name=difficultySelector]:checked").value;
    if (gameState.selectedPairsCustomInput <= 0) {
        gameState.totalPairsToFind = gameState.selectedPairsRadioInput;
    } else {
        gameState.totalPairsToFind = gameState.selectedPairsCustomInput;
    }
}

function randomColorGenerator () {
    for (i = 0; i < gameState.totalPairsToFind; i++) {
        let f = '#' + Math.floor(Math.random()*15).toString(16) + Math.floor(Math.random()*15).toString(16) + Math.floor(Math.random()*15).toString(16) + Math.floor(Math.random()*15).toString(16) + Math.floor(Math.random()*15).toString(16) + Math.floor(Math.random()*15).toString(16);
        gameState.cardColorPairs.push(f, f);
    }
}

function shuffle() {
    for (let i = gameState.cardColorPairs.length -1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        let k = gameState.cardColorPairs[i];
        gameState.cardColorPairs[i] = gameState.cardColorPairs[j];
        gameState.cardColorPairs[j] = k;
    }
    for (let a = 0; a < gameState.totalPairsToFind*2; a++) {
        const CURRENT_CARD = document.getElementById("card" + a);
        CURRENT_CARD.dataset.color = gameState.cardColorPairs[a];
    }
}

function revealCard(c) {
    if (gameState.canClick == true) {
        const CARD = document.getElementById(c);
        const COLOR = CARD.getAttribute("data-color");
        CARD.style.setProperty("--real-color", COLOR);
        CARD.className = "flipped";
        if (gameState.firstCardFlipped == false) {
            gameState.firstClickedCardColor = COLOR;
            gameState.firstClickedCard = CARD;
            gameState.firstCardFlipped = true;
        } else if (gameState.firstClickedCard == CARD) {

        } else {
            gameState.canClick = false;
            gameState.secondClickedCardColor = COLOR;
            gameState.secondClickedCard = CARD;
            if (gameState.firstClickedCardColor === gameState.secondClickedCardColor) {
                setTimeout(
                    hideCards,
                    FLIP_DELAY_MS
                )
            } else {
                setTimeout(
                    returnCards,
                    FLIP_DELAY_MS
                )
            }
        gameState.currentTries = gameState.currentTries +1;
        document.getElementById("tryCounter").innerHTML = "Versuche: " +gameState.currentTries;
        setTimeout(
            resetDraws,
            1100
        )
        }
    }
}

function startTimer() {
    document.getElementById("timer").innerHTML = "Timer: " + gameState.currentTime + " Sekunden";
    if (gameState.isPlaying == true) {
        gameState.currentTime = gameState.currentTime +1;
        setTimeout(startTimer, 1000)
    }
}

function hideCards () {
    gameState.firstClickedCard.className = "matched";
    gameState.secondClickedCard.className = "matched";
    gameState.pairsFound = gameState.pairsFound +1;
    if (gameState.pairsFound == gameState.totalPairsToFind) {
        START_BUTTON.removeAttribute("disabled");
        START_BUTTON.style.opacity = 1;
        saveHighscore()
        gameState.isPlaying = false;
    }
}

function returnCards () {
    gameState.firstClickedCard.className = "card";
    gameState.secondClickedCard.className = "card";
}

function resetDraws() {
    gameState.firstCardFlipped = false;
    gameState.canClick = true;
}

function saveHighscore() {
    gameState.playedGamesCounter = gameState.playedGamesCounter +1;
    localStorage.setItem("playedGamesCounter", gameState.playedGamesCounter);
    localStorage.setItem("timeGame" +gameState.playedGamesCounter, gameState.currentTime);
    localStorage.setItem("triesGame" +gameState.playedGamesCounter, gameState.currentTries);
    localStorage.setItem("pairsGame" +gameState.playedGamesCounter, gameState.totalPairsToFind);
    localStorage.setItem("entry" +gameState.playedGamesCounter, gameState.playedGamesCounter);
    loadScoreboard();
}

function loadScoreboard() {
    var scoreboardEntry = document.getElementsByClassName("scoreboardEntry");
    while (scoreboardEntry.firstChild) {
        scoreboardEntry.removeChild(scoreboardEntry.firstChild);
    }
    var scoreboard = document.getElementById("scoreboard");
    while (scoreboard.firstChild) {
        scoreboard.removeChild(scoreboard.firstChild);
    }
    for (l = 1; l <= gameState.playedGamesCounter; l++) {
        const ENTRY = document.createElement("div");
        ENTRY.id = "scoreboardEntry" + l;
        ENTRY.className = "scoreboardEntry";
        const ENTRY_NUMBER = document.createElement("div");
        ENTRY_NUMBER.id = "entryNumber" + l;
        ENTRY_NUMBER.className = "entryComponent";
        ENTRY_NUMBER.innerHTML = l + ".";
        const ENTRY_TIME = document.createElement("div");
        ENTRY_TIME.id = "entryTime" + l;
        ENTRY_TIME.className = "entryComponent";
        ENTRY_TIME.innerHTML = "Zeit: " + localStorage.getItem("timeGame" +l) + "s";
        const ENTRY_TRIES = document.createElement("div");
        ENTRY_TRIES.id = "entryTries" + l;
        ENTRY_TRIES.className = "entryComponent";
        ENTRY_TRIES.innerHTML = "Versuche: " + localStorage.getItem("triesGame" +l);
        const ENTRY_PAIRS = document.createElement("div");
        ENTRY_PAIRS.id = "entryPairs" + l;
        ENTRY_PAIRS.className = "entryComponent";
        ENTRY_PAIRS.innerHTML = "Paare: " + localStorage.getItem("pairsGame" +l);
        document.getElementById("scoreboard").appendChild(ENTRY);
        document.getElementById("scoreboardEntry" +l).appendChild(ENTRY_NUMBER);
        document.getElementById("scoreboardEntry" +l).appendChild(ENTRY_TIME);
        document.getElementById("scoreboardEntry" +l).appendChild(ENTRY_TRIES);
        document.getElementById("scoreboardEntry" +l).appendChild(ENTRY_PAIRS);
    }
}

function resetScoreboard() {
    localStorage.clear();
    gameState.playedGamesCounter = 0;
    loadScoreboard();
}