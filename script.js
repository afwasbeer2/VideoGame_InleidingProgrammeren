function playSoundWin () {
	let geluid = new Audio('sounds/win.mp3');
	geluid.play();
}

function playSoundLose () {
	let geluid = new Audio('sounds/lose.mp3');
	geluid.play();
}

// refreshed de pagina om opnieuw te beginnen
window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();

    document.getElementById("restart").addEventListener("click", function() {
        location.reload(); 
    });
}

function startTimer() {
    timer = setTimeout(function() {
        alert("Bent u nog steeds aan het spelen?");
    }, 5 * 60 * 1000); // 5 minuten in milliseconden
}

function resetTimer() {
    clearTimeout(timer);
    startTimer();
}

//variabelen
let dealerAantal = 0; //dealer aantal kaarten

let aantal = 0; // speler aantal kaarten

let dealerAceAantal = 0; // dealer aantal ace

let aantalAce = 0; //speler aantal ace

let hidden; // hidden kaart dealer

let deck; // deck

let timer; // timer

let canHit = true; //kaarten pakken tot 21

// maakt alle soorten kaarten aan
function buildDeck() {
    let types = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let soort = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < soort.length; i++) {
        for (let j = 0; j < types.length; j++) {
            deck.push(types[j] + "-" + soort[i]); 
        }
    }
}

// schud alle kaarten
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    console.log(deck);
}


function startGame() {
    startTimer();
    //laat dealer pakken tot 17
    hidden = deck.pop();
    dealerAantal += getValue(hidden);
    dealerAceAantal += checkAce(hidden);
    while (dealerAantal < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerAantal += getValue(card);
        dealerAceAantal += checkAce(card);
        document.getElementById("dealer-kaarten").append(cardImg);
    }

    console.log(dealerAantal);

    // geeft speler 2 kaarten
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        aantal += getValue(card);
        aantalAce += checkAce(card);
        document.getElementById("speler-kaarten").append(cardImg);
    }

    document.getElementById("speler-aantal").innerText = aantal;
    console.log(aantal);

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);

}

function hit() {
    //kijkt of speler nog kan pakken
    if (!canHit) {
        return;
    }
    // geeft speler een extra kaart
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    aantal += getValue(card);
    aantalAce += checkAce(card);
    document.getElementById("speler-kaarten").append(cardImg);

    // Update spelerScore en weergave
    aantal = reduceAce(aantal, aantalAce);
    document.getElementById("speler-aantal").innerText = aantal;
    
    //eindigt game als speler 21 heeft
    if (aantal > 21) {
        canHit = false;
        endGame();
    }
    resetTimer();
}

function stay() {
    // zorgt ervoor als speler ace heeft en boven 21 zit ace een 1 word inplaats van 11
    dealerAantal = reduceAce(dealerAantal, dealerAceAantal);
    aantal = reduceAce(aantal, aantalAce);

    //laat dealer hidden kaart zien
    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";
    // als je boven de 21 zit
    let message = "";
    if (aantal > 21) {
        message = "You Lose!";
        playSoundLose();
    }
    // als dealer boven de 21 zit
    else if (dealerAantal > 21) {
        message = "You win!";
        playSoundWin();
    }
    // beide zelfde aantal
    else if (aantal == dealerAantal) {
        message = "Tie!";
    }
    // als je meer dan dealer hebt
    else if (aantal > dealerAantal) {
        message = "You Win!";
        playSoundWin();
    }
    // als dealer meer heeft
    else if (aantal < dealerAantal) {
        message = "You Lose!";
        playSoundLose();
    }

    document.getElementById("dealer-aantal").innerText = dealerAantal;
    document.getElementById("speler-aantal").innerText = aantal;
    document.getElementById("results").innerText = message;
    resetTimer();
}


// kijkt of je een A J Q K hebt
function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}
// kijkt of je een ACE hebt
function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

// zorgt ervoor dat je ace 1 word als je boven de 21 zit
function reduceAce(playerAantal, playerAceAantal) {
    while (playerAantal > 21 && playerAceAantal > 0) {
        playerAantal -= 10;
        playerAceAantal -= 1;
    }
    return playerAantal;
}

// als speler 21 heeft
function endGame() {
    dealerAantal = reduceAce(dealerAantal, dealerAceAantal);
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (dealerAantal <= 21 || aantal > 21) {
        message = "You Lose!";
    } else {
        message = "Both players busted!";
    }

    document.getElementById("dealer-aantal").innerText = dealerAantal;
    document.getElementById("speler-aantal").innerText = aantal;
    document.getElementById("results").innerText = message;
    gameStarted = false;
}