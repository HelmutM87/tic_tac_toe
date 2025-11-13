let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

let currentPlayer = 'X';

let audioDrop = new Audio('sounds/drop.mp3');
let audioGameOver = new Audio('sounds/game_over.mp3');  // Korrigiere die Dateiendung auf '.mp3'
let audioWinner = new Audio('sounds/winner.mp3');

audioDrop.volume = 1;
audioGameOver.volume = 1;
audioWinner.volume = 1;

document.addEventListener('DOMContentLoaded', function () {
    // Dein bestehender Code hier
    init();
});

function init() {
    render();
}

function renderCell(index) {
    const cell = document.getElementById(`cell-${index}`);
    cell.innerHTML = convertToSymbol(fields[index], index);
}

function playAudio(audio) {
    audio.currentTime = 0;  // Zurückspulen, um das Audio bei wiederholtem Abspielen sofort zu starten
    audio.play();
}

function render() {
    const contentDiv = document.getElementById('content');
    let tableHtml = '<table>';

    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            tableHtml += `<td id="cell-${index}" onclick="cellClick(${index})" ${fields[index] ? 'disabled' : ''}>${convertToSymbol(fields[index], index)}</td>`;
        }
        tableHtml += '</tr>';
    }

    tableHtml += '</table>';
    contentDiv.innerHTML = tableHtml;

    // Überprüfen auf Gewinner nach jedem Rendern
    checkWinner();
}

function cellClick(index) {
    // Überprüfen, ob das Spiel bereits vorbei ist
    if (!checkWinner()) {
        // Überprüfen, ob die Zelle bereits belegt ist
        if (fields[index] === null) {
            // Zelle mit dem aktuellen Spielerzeichen belegen
            fields[index] = currentPlayer;

            // Spieler wechseln
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

            // Nur die Zelle neu rendern, die geändert wurde
            renderCell(index);

            // Überprüfen auf Gewinner nach jedem Zug
            if (checkWinner()) {
                // Gewonnen! Hier kannst du weitere Aktionen hinzufügen.

                // Hier könntest du das Spiel zurücksetzen oder andere Aktionen durchführen.
            }

            // Ton abspielen
            playAudio(audioDrop);
        }
    }
}

// ... (Rest deines Codes)


// Funktion zum Konvertieren des Spielerzeichens
function convertToSymbol(symbol, index) {
    if (symbol === 'O') {
        return generateAnimatedCircleSVG(index);
    } else if (symbol === 'X') {
        return generateAnimatedCrossSVG(index);
    } else {
        return ''; // Falls das Feld null ist, kein Zeichen anzeigen
    }
}

function generateAnimatedCircleSVG(index) {
    const svgCode = `
        <svg width="70" height="70" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="30" fill="none" stroke="#00B0EF" stroke-width="5">
                <animate attributeName="r" values="0;30" dur="200ms" begin="0s" keytimes="0;1" keySplines=".42 0 .58 1"/>
            </circle>
        </svg>
    `;

    return svgCode;
}

function generateAnimatedCrossSVG(index) {
    const svgCode = `
    <svg width="70" height="70" xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="60" x2="60" y2="10" stroke="#FFC000" stroke-width="5">
        <animate attributeName="x2" values="10;60" dur="200ms" begin="0s" keytimes="0;1" keySplines=".42 0 .58 1"/>
    </line>
    <line x1="60" y1="60" x2="10" y2="10" stroke="#FFC000" stroke-width="5">
        <animate attributeName="x2" values="60;10" dur="200ms" begin="0s" keytimes="0;1" keySplines=".42 0 .58 1"/>
    </line>
    </svg>
    `;

    return svgCode;
}

function drawWinningLine(combination) {
    // CSS-Klasse für die gewinnende Linie
    const winningClass = 'winning-line';

    // Entferne vorherige Gewinnerklasse von allen Zellen
    document.querySelectorAll('.winning-line').forEach(cell => {
        cell.classList.remove(winningClass);
    });

    // Füge die Gewinnerklasse den beteiligten Zellen hinzu
    for (const index of combination) {
        const cellId = `cell-${index}`;
        const cell = document.getElementById(cellId);

        if (cell) {
            cell.classList.add(winningClass);
        } else {
            console.error(`Zelle (${cellId}) nicht gefunden.`);
        }
    }
}

function checkWinner() {
    // Überprüfen auf horizontale, vertikale und diagonale Gewinner
    if (checkLine(0, 1, 2) || checkLine(3, 4, 5) || checkLine(6, 7, 8) ||
        checkLine(0, 3, 6) || checkLine(1, 4, 7) || checkLine(2, 5, 8) ||
        checkLine(0, 4, 8) || checkLine(2, 4, 6)) {

        // Gewonnen! Hier kannst du weitere Aktionen hinzufügen.
        const winner = currentPlayer === 'X' ? 'O' : 'X';

        // Zeichne die Gewinnlinie nur, wenn lastWinningCombination gültig ist
        if (lastWinningCombination) {
            drawWinningLine(lastWinningCombination);
        }

        // Zeige den "Nochmal spielen"-Button an
        showPlayAgainButton();

        // Hier könntest du das Spiel zurücksetzen oder andere Aktionen durchführen.

        // Ton für den Gewinner abspielen
        playAudio(audioWinner);

        return true; // Gewinner gefunden
    }

    // Überprüfen auf Unentschieden (Unentschieden, wenn alle Felder belegt sind und kein Gewinner)
    if (fields.every(field => field !== null)) {
        // Unentschieden! Hier kannst du weitere Aktionen hinzufügen.

        // Zeige den "Nochmal spielen"-Button an
        showPlayAgainButton();

        // Ton für Game Over abspielen
        playAudio(audioGameOver);

        return true; // Unentschieden
    }

    // Kein Gewinner oder Unentschieden
    // Verstecke den "Nochmal spielen"-Button
    hidePlayAgainButton();

    return false;
}



let lastWinningCombination = null;

function checkLine(a, b, c) {
    if (fields[a] !== null && fields[a] === fields[b] && fields[a] === fields[c]) {
        lastWinningCombination = [a, b, c];
        return true;
    }
    return false;
}
function showPlayAgainButton() {
    const playAgainButton = document.querySelector('.play-again-button');
    playAgainButton.style.display = 'block';
}

function hidePlayAgainButton() {
    const playAgainButton = document.querySelector('.play-again-button');
    playAgainButton.style.display = 'none';
}

function playAgain() {
    // Setze das Spiel zurück (zum Beispiel Felder leeren)
    fields = Array(9).fill(null);

    // Verstecke den "Nochmal spielen"-Button
    hidePlayAgainButton();

    // Setze den aktuellen Spieler auf 'X'
    currentPlayer = 'X';

    // Rendere das Spielfeld neu
    render();

    // Entferne die Gewinnerklasse von allen Zellen
    document.querySelectorAll('.winning-line').forEach(cell => {
        cell.classList.remove('winning-line');
    });

    // Setze die letzte Gewinnerkombination auf null zurück
    lastWinningCombination = null;
}
