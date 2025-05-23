const CARD_CLASS = "card";
const FLIPPED_CLASS = "flipped";
const MATCHED_CLASS = "matched";
const START_BUTTON = document.getElementById("startButton");
const GAMEBOARD = document.getElementById("game-board");
const FLIP_DELAY_MS = 1000;
const NEXT_TRY_DELAY_MS = 1000;

let gameState = {
    playedGamesCounter: Number(localStorage.getItem("playedGamesCounter")),
    firstCardFlipped: false,
    canClick: true,
    isPlaying: false,    
    pairsFound: 0,
    totalPairsToFind: 0,
    selectedPairsCustomInput: 0,
    selectedPairsRadioInput: 0,
    currentTries: 0,
    currentTime: 0,
    firstClickedCard: "",
    secondClickedCard: "",
    firstClickedCardColor: "",
    secondClickedCardColor: "",
    cardColorPairs: [],
    memoryScoreboard: [],
}

const SCOREBOARD_ENTRY = {
    id: 0,
    time: 0,
    tries: 0,
    pairs: 0
}

function initiateGameRound() { //Funktion zum Starten einer Spielrunde
    disableStartButton();
    getSelectedPairs ();
    clearGameboard();
    generateCards();
    gameState.cardColorPairs = []; //Das Array mit allen Farbpaaren wird geleert
    GAMEBOARD.scrollIntoView({block: "center", behavior: "instant"})
    gameState.pairsFound = 0; //Ab hier werden erstmal alle relevanten Variablen zurückgesetzt
    gameState.currentTries = 0;
    gameState.isPlaying = true;
    gameState.currentTime = 0;
    document.getElementById("tryCounter").innerHTML = "Versuche: " +gameState.currentTries;
    randomColorPairsGenerator();
    shuffleCards();
    assignColorsToCards();
    startTimer();
}

function disableStartButton() {
    START_BUTTON.disabled = "true";
    START_BUTTON.style.opacity = "0.5";
}

function getSelectedPairs() {
    gameState.selectedPairsCustomInput = document.getElementById("pairsCustom").value;
    gameState.selectedPairsRadioInput = document.querySelector("input[name=difficultySelector]:checked").value;
    if (gameState.selectedPairsCustomInput <= 0) { //Wenn der Spieler keine Custom Kartenanzahl angibt, wird der Wert des Radiomenüs verwendet
        gameState.totalPairsToFind = gameState.selectedPairsRadioInput;
    } else { //Wenn der Spieler eine zugelassenen Custom Kartenzahl angibt, wird diese verwendet
        gameState.totalPairsToFind = gameState.selectedPairsCustomInput;
    }
}

function clearGameboard() {
    while (GAMEBOARD.firstChild) {
        GAMEBOARD.removeChild(GAMEBOARD.firstChild);
    }
}

function generateCards() {
    for (let b = 0; b < gameState.totalPairsToFind*2; b++) { //Wird sooft ausgeführt, wie es Karten geben soll
        const CARD = document.createElement("div"); //Eine Karte wird erschaffen
        CARD.id = "card" + b; //Die Karte erhält eine einzigartige ID
        CARD.className = CARD_CLASS; //Die Karte wird der Karten-Klasse zugeordnet
        CARD.addEventListener("click", function(){revealCard("card" + b)}); //Die Karte erhält einen Click-Event-Listener
        document.getElementById("game-board").appendChild(CARD); //Die Karte wird dem Spielbrett zugeordnet
    }
}

function randomColorPairsGenerator () { 
    for (let i = 0; i < gameState.totalPairsToFind; i++) { //Es wird für jedes Kartenpaar eine Zufallsfarbe erstellt
        let f = "#"
        for (let a = 0; a < 6; a++) {
            f = f + Math.floor(Math.random()*15).toString(16);
        }
        gameState.cardColorPairs.push(f, f); //Die Farbe wird zweifach ins Farbenarray gepusht (zweifach wegen zwei Karten pro Paar)
    }
}

function shuffleCards() { //Die Farben im Farbenarray werden per Fisher-Yates Algorithmus gemischt
    for (let i = gameState.cardColorPairs.length -1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        let k = gameState.cardColorPairs[i];
        gameState.cardColorPairs[i] = gameState.cardColorPairs[j];
        gameState.cardColorPairs[j] = k;
    }
}

function assignColorsToCards() { //Jeder Karte wird eine Farbe aus dem Farbenarray zugeordnet
    for (let a = 0; a < gameState.totalPairsToFind*2; a++) {
        const CURRENT_CARD = document.getElementById("card" + a);
        CURRENT_CARD.dataset.color = gameState.cardColorPairs[a];
    }
}

function revealCard(c) {
    if (gameState.canClick) { //Wenn es erlaubt ist, eine Karte anzuklicken:
        const CARD = document.getElementById(c); //Die angeklickte Karte wird zwischengespeichert
        const COLOR = CARD.getAttribute("data-color"); //Die Farbe der Karte wird zwischengespeichert
        CARD.style.setProperty("--real-color", COLOR); //Die CSS-Variable "--real-color" wird auf die Farbe der Karte gesetzt
        CARD.className = FLIPPED_CLASS; //Die Klasse der Karte wird auf umgedreht gesetzt
        if (gameState.firstCardFlipped == false) { //Wenn die Karte die erste Karte ist:
            gameState.firstClickedCardColor = COLOR; //Die Farbe der Karte wird temporaer gespeichert
            gameState.firstClickedCard = CARD; //Die Karte wird temporaer gespeichert
            gameState.firstCardFlipped = true; //Es wird erkannt, dass nun die erste Karte gewählt wurde
        } else if (gameState.firstClickedCard === CARD) { //Verhindert, dass nicht zweimal die gleiche Karte gewählt wird

        } else { //Wenn die Karte die zweite Karte ist:
            gameState.canClick = false; //Man kann nun keine weitere Karte wählen
            gameState.secondClickedCardColor = COLOR; //Die Farbe der Karte wird temporaer gespeichert
            gameState.secondClickedCard = CARD; //Die Karte wird temporaer gespeichert
            if (gameState.firstClickedCardColor === gameState.secondClickedCardColor) { //Wenn beide Karten zusammenpassen (Gleiche Farbe):
                setTimeout( //Nach kurzer Verzögerung werden beide Karten verschwinden
                    hideCards,
                    FLIP_DELAY_MS
                )
            } else { //Wenn die Karten nicht zusammenpassen:
                setTimeout( //Nach kurzer Verzögerung werden beide Karten wieder ins Spiel kommen
                    returnCards,
                    FLIP_DELAY_MS
                )
            }
        gameState.currentTries = gameState.currentTries +1; //Die Versuche werden erhöht
        document.getElementById("tryCounter").innerHTML = "Versuche: " +gameState.currentTries;
        setTimeout(
            allowNextTry,
            NEXT_TRY_DELAY_MS
        )
        }
    }
}

function startTimer() {
    document.getElementById("timer").innerHTML = "Timer: " + gameState.currentTime + " Sekunden";
    if (gameState.isPlaying) { //Wenn ein Spiel aktiv ist, zählt der Timer hoch
        gameState.currentTime = gameState.currentTime +1;
        setTimeout(startTimer, 1000)
    }
}

function hideCards () {
    gameState.firstClickedCard.className = MATCHED_CLASS; //Die erste gefundene Karte wird versteckt
    gameState.secondClickedCard.className = MATCHED_CLASS; //Die zweite gefundene Karte wird versteckt
    gameState.pairsFound = gameState.pairsFound +1; //Der Counter für gefundene Paare geht hoch
    if (gameState.pairsFound == gameState.totalPairsToFind) { //Wenn alle Paare gefunden wurden, wird alles für eine nächste Runde vorbereitet
        START_BUTTON.removeAttribute("disabled");
        START_BUTTON.style.opacity = "1";
        saveHighscore();
        gameState.isPlaying = false;
    }
}

function returnCards () {
    gameState.firstClickedCard.className = CARD_CLASS;
    gameState.secondClickedCard.className = CARD_CLASS;
}

function allowNextTry() { //Ein nächster Versuch wird zugelassen
    gameState.firstCardFlipped = false;
    gameState.canClick = true;
}

function saveHighscore() {
    gameState.playedGamesCounter = gameState.playedGamesCounter +1;
    localStorage.setItem("playedGamesCounter", gameState.playedGamesCounter);
    const NEW_ENTRY = Object.create(SCOREBOARD_ENTRY);
    NEW_ENTRY.id = gameState.playedGamesCounter;
    NEW_ENTRY.pairs = Number(gameState.totalPairsToFind);
    NEW_ENTRY.tries = gameState.currentTries;
    NEW_ENTRY.time = gameState.currentTime;
    console.log(NEW_ENTRY);
    gameState.memoryScoreboard.push(NEW_ENTRY);
    gameState.memoryScoreboard.sort((a, b) => a.tries - b.tries);
    console.log(gameState.memoryScoreboard);
    localStorage.setItem("memoryScoreboard", JSON.stringify(gameState.memoryScoreboard));
    loadScoreboard();
}

function loadScoreboard() {
    const scoreboard = document.getElementById("scoreboard");
    while (scoreboard.firstChild) {
        scoreboard.removeChild(scoreboard.firstChild);
    }
    let loadedScoreboard = JSON.parse(localStorage.getItem("memoryScoreboard")).slice(0, 10);
    let loadedScoreboardLengt = loadScoreboard.length;
    for (let i = 0; i < loadedScoreboardLengt; i++) {
        scoreboard.appendChild(loadedScoreboard[i]);
    }
}

/* function saveHighscore() { //Alle Rundendaten werden in LocalStorage mit einzigartiger ID geschrieben
    gameState.playedGamesCounter = gameState.playedGamesCounter +1;
    localStorage.setItem("playedGamesCounter", gameState.playedGamesCounter);
    localStorage.setItem("timeGame" +gameState.playedGamesCounter, gameState.currentTime);
    localStorage.setItem("triesGame" +gameState.playedGamesCounter, gameState.currentTries);
    localStorage.setItem("pairsGame" +gameState.playedGamesCounter, gameState.totalPairsToFind);
    localStorage.setItem("entry" +gameState.playedGamesCounter, gameState.playedGamesCounter);
    loadScoreboard();
}

function loadScoreboard() {
    var scoreboardEntry = document.getElementsByClassName("scoreboardEntry"); //Zuerst wird das Scoreboard zurückgesetzt
    while (scoreboardEntry.firstChild) {
        scoreboardEntry.removeChild(scoreboardEntry.firstChild);
    }
    var scoreboard = document.getElementById("scoreboard");
    while (scoreboard.firstChild) {
        scoreboard.removeChild(scoreboard.firstChild);
    }
    for (l = 1; l <= gameState.playedGamesCounter; l++) { //Nun werden für jedes Spiel alle Werte zusammengetragen und angezeigt
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
} */