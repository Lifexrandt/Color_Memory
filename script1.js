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


function createCards() {
    gameState.selectedPairsCustomInput = document.getElementById("pairsCustom").value;
    gameState.selectedPairsRadioInput = document.querySelector("input[name=difficultySelector]:checked").value;
    if (gameState.selectedPairsCustomInput <= 0) {
        gameState.totalPairsToFind = gameState.selectedPairsRadioInput;
    } else {
        gameState.totalPairsToFind = gameState.selectedPairsCustomInput;
    }
    var gameboard = document.getElementById("game-board");
    while (gameboard.firstChild) {
        gameboard.removeChild(gameboard.firstChild);
    }
    gameState.cardColorPairs = [];
    for (let b = 0; b < gameState.totalPairsToFind*2; b++) {
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
    gameState.pairsFound = 0;
    gameState.currentTries = 0;
    document.getElementById("tryCounter").innerHTML = "Versuche: " +gameState.currentTries;
    randomColorGenerator();
    shuffle();
    gameState.isPlaying = true;
    gameState.currentTime = 0;
    startTimer();
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
        const currentCard = document.getElementById("card" + a);
        currentCard.dataset.color = gameState.cardColorPairs[a];
    }
}

function revealCard(c) {
    if (gameState.canClick == true) {
        const card = document.getElementById(c);
        const color = card.getAttribute("data-color");
        console.log(color)
        card.style.setProperty("--real-color", color);
        card.className = "flipped";
        if (gameState.firstCardFlipped == false) {
            gameState.firstClickedCardColor = color;
            gameState.firstClickedCard = card;
            gameState.firstCardFlipped = true;
        } else if (gameState.firstClickedCard == card) {

        } else {
            gameState.canClick = false;
            gameState.secondClickedCardColor = color;
            gameState.secondClickedCard = card;
            if (gameState.firstClickedCardColor === gameState.secondClickedCardColor) {
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

function removeCards () {
    gameState.firstClickedCard.className = "matched";
    gameState.secondClickedCard.className = "matched";
    gameState.pairsFound = gameState.pairsFound +1;
    if (gameState.pairsFound == gameState.totalPairsToFind) {
        const pauseButton = document.getElementById("startButton");
        pauseButton.removeAttribute("disabled");
        pauseButton.style.opacity = 1;
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
    localStorage.setItem("trysGame" +gameState.playedGamesCounter, gameState.currentTries);
    localStorage.setItem("pairsGame" +gameState.playedGamesCounter, gameState.totalPairsToFind);
    localStorage.setItem("entry" +gameState.playedGamesCounter, gameState.playedGamesCounter);
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
    for (l = 1; l <= gameState.playedGamesCounter; l++) {
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

function resetScoreboard() {
    localStorage.clear();
    gameState.playedGamesCounter = 0;
    loadScoreboard();
}