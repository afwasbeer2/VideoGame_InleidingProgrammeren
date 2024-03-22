// speelt een geluid als je wint
function playSoundWin() {
    let geluid = new Audio('sounds/win.mp3');
    geluid.play();
}
// speelt een geluid als je verliest
function playSoundLose() {
    let geluid = new Audio('sounds/lose.mp3');
    geluid.play();
}

// refreshed de pagina om opnieuw te beginnen

window.onload = function () {
    buildDeck();
    shuffleDeck();
    startGame();

    document.getElementById("restart").addEventListener("click", function () {
        location.reload();
    });
}
// start een timer van 5 minuten en geeft uit eindelijk een melding
function startTimer() {
    timer = setTimeout(function () {
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

// functie om player kaart aan te maken
function dealPlayerCard() {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    aantal += getValue(card);
    aantalAce += checkAce(card);
    document.getElementById("speler-kaarten").append(cardImg);
}

// functie om dealer kaart aan te maken
function dealDealerCard() {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    dealerAantal += getValue(card);
    dealerAceAantal += checkAce(card);
    document.getElementById("dealer-kaarten").append(cardImg);
}
// start het spel
function startGame() {
    startTimer();
    //laat dealer pakken tot 17
    hidden = deck.pop();
    dealerAantal += getValue(hidden);
    dealerAceAantal += checkAce(hidden);
    while (dealerAantal < 17) {
        dealDealerCard();
    }

    console.log(dealerAantal);

    // geeft speler 2 kaarten
    for (let i = 0; i < 2; i++) {
        dealPlayerCard();
    }
    // laat speeler aantal zien
    document.getElementById("speler-aantal").innerText = aantal;
    console.log(aantal);

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);

}

// functie om speler kaart te pakken
function hit() {
    // Controleer of de speler kan blijven pakken
    if (!canHit) {
        return;
    }

    // Geef de speler een extra kaart
    dealPlayerCard();

    // Update de spelerScore en weergave
    aantal = reduceAce(aantal, aantalAce);
    document.getElementById("speler-aantal").innerText = aantal;

    // Als de speler een Aas heeft en het totale aantal gelijk aan of minder dan 21 is, laat ze dan doorgaan met pakken
    if (aantalAce > 0 && aantal <= 21) {
        // Update de spelerAceAantal
        aantalAce--;
        // Blijf de speler toestaan om te pakken
        return;
    }

    // Eindig het spel als de speler boven 21 gaat of als ze geen Aas meer hebben
    canHit = false;
    if (aantal > 21 || aantalAce === 0) {
        endGame();
    }

    resetTimer();
}

// functie als speler geen kaart meer wilt pakken
function stay() {
    // Zorg ervoor dat de dealer kaarten blijft trekken tot 17
    while (dealerAantal < 17) {
        dealDealerCard();
    }

    // Update dealerScore en weergave
    dealerAantal = reduceAce(dealerAantal, dealerAceAantal);
    document.getElementById("dealer-aantal").innerText = dealerAantal;

    // Vergelijk de scores om te bepalen wie er wint
    let message = "";
    if (aantal > 21) {
        message = "Verloren!";
        playSoundLose();
    } else if (dealerAantal > 21) {
        message = "Gewonnen!";
        playSoundWin();
    } else if (aantal == dealerAantal) {
        message = "gelijkspel!";
    } else if (aantal > dealerAantal) {
        message = "Gewonnen!";
        playSoundWin();
    } else if (aantal < dealerAantal) {
        message = "Verloren!";
        playSoundLose();
    }

    // Toon het bericht en stop de timer
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