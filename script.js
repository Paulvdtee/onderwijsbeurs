// Game configuratie
const GRID_SIZE = 4;
const GAME_DURATION = 60;
const CELL_ACTIVE_TIME = 1500;
const SPEED_INCREASE_INTERVAL = 10000;
const MIN_ACTIVE_CELLS = 1;
const MAX_ACTIVE_CELLS = 3;

// Google Sheets configuratie
const SHEET_ID = '11jWwuZIAYHFURWAgOHvmm151c0qFRdbTIXyFe097_bQ';
const API_KEY = 'AIzaSyBme5mYvFXL1oM5hjBkxhJkZtc5uXg1ZPI';
const RANGE = 'A:D';

// Game state
let score = 0;
let timeLeft = GAME_DURATION;
let gameInterval;
let timerInterval;
let activeCells = [];
let comboCount = 0;
let gameSpeed = 1;

// DOM elementen
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const grid = document.getElementById('grid');
const scoreDisplay = document.querySelector('#score span');
const timerDisplay = document.querySelector('#timer span');
const finalScoreDisplay = document.querySelector('#final-score span');
const startButton = document.getElementById('start-game');
const playAgainButton = document.getElementById('play-again');
const scoreForm = document.getElementById('score-form');
const highscoresList = document.getElementById('highscores-list');

// Banned woorden lijst
const BANNED_NAMES = [
    // Nederlandse scheldwoorden
    'kut', 'k0t', 'kut3', 'k_ut', 'kutt',
    'lul', 'l0l', 'lul3', 'l_ul', 'lull',
    'pik', 'p1k', 'pik3', 'p_ik', 'pikk',
    'kloot', 'klote', 'kl0te', 'kl_te',
    'hoer', 'h0er', 'ho3r', 'h_er', 'hoor',
    'teef', 'te3f', 't33f', 't_ef', 'teeff',
    'kanker', 'k4nker', 'kanc3r', 'k_nker', 'kankr',
    'tyfus', 'tyf0s', 'tyf_s', 't1fus',
    'tering', 'ter1ng', 't3ring', 't_ring',
    'godver', 'g0dver', 'godv3r', 'g_dver',
    
    // Engelse scheldwoorden
    'fuck', 'fuk', 'f0ck', 'f_ck', 'phuck',
    'shit', 'sh1t', 'sh_t', 'sht', 'sh17',
    'bitch', 'b1tch', 'b_tch', 'bytch',
    'damn', 'd4mn', 'd_mn', 'dam',
    'hell', 'h3ll', 'h_ll', 'hel',
    'crap', 'cr4p', 'cr_p', 'krap',
    'piss', 'p1ss', 'p_ss', 'pis',
    'ass', '4ss', '_ss', 'ars',
    'gay', 'g4y', 'g_y', 'gai',
    'homo', 'h0mo', 'h_mo', 'hom0',
    'retard', 'ret4rd', 'ret_rd', 'rtard',
    'spast', 'sp4st', 'sp_st', 'spastic',
    
    // Ziektes/medisch misbruik
    'aids', '4ids', '_ids', 'aides',
    'hiv', 'h1v', 'h_v',
    'corona', 'c0rona', 'cor0na', 'c_rona',
    'covid', 'c0vid', 'cov1d', 'c_vid',
    'autisme', '4utisme', '_utisme', 'autism',
    'downie', 'd0wnie', 'd_wnie', 'down',
    'mongool', 'm0ngool', 'm_ngool', 'mongo',
    
    // Racistische termen
    'neger', 'n3ger', 'n_ger', 'negr',
    'nikker', 'n1kker', 'n_kker', 'nikr',
    'allochtoon', '4llochtoon', '_llochtoon',
    
    // Leet speak patronen
    'b00bs', 'b0obs', 'b_obs',
    'd1ck', 'd_ck', 'dik',
    'c0ck', 'c_ck', 'kok',
    'p0rn', 'p_rn', 'pr0n',
    's3x', 's_x', 'seks',
    
    // Website/spam woorden
    'www', 'http', 'https', '.com', '.nl',
    'spam', 'sp4m', 'sp_m',
    'bot', 'b0t', 'b_t',
    'hack', 'h4ck', 'h_ck', 'hax',
];

// Laad highscores
async function loadHighscores() {
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`);
        const data = await response.json();
        
        if (data.values) {
            // Sorteer op score (kolom D) en neem top 10
            const scores = data.values
                .slice(1) // Skip header row
                .map(row => ({
                    name: row[1],
                    score: parseInt(row[3])
                }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
            
            // Update de highscores lijst
            highscoresList.innerHTML = scores
                .map((score, index) => `
                    <div class="highscore-item">
                        <span>${index + 1}. ${score.name}</span>
                        <span>${score.score}</span>
                    </div>
                `)
                .join('');
        }
    } catch (error) {
        console.error('Fout bij het laden van highscores:', error);
        highscoresList.innerHTML = '<div class="highscore-item">Scores worden binnenkort bijgewerkt</div>';
    }
}

// Sla score op
async function saveScore(name, email) {
    try {
        const timestamp = new Date().toISOString();
        const values = [[timestamp, name, email, score]];
        
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: values
            })
        });
        
        if (response.ok) {
            await loadHighscores(); // Herlaad de highscores na het opslaan
            return true;
        }
        return false;
    } catch (error) {
        console.error('Fout bij het opslaan van score:', error);
        return false;
    }
}

// Initialiseer het grid
function initGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        grid.appendChild(cell);
    }
}

// Start het spel
function startGame() {
    score = 0;
    timeLeft = GAME_DURATION;
    gameSpeed = 1;
    comboCount = 0;
    activeCells = [];
    
    updateScore();
    updateTimer();
    
    menuScreen.classList.remove('active');
    gameScreen.classList.add('active');
    gameOverScreen.classList.remove('active');
    
    gameInterval = setInterval(gameLoop, 1000 / gameSpeed);
    timerInterval = setInterval(updateGameTimer, 1000);
    
    // Verhoog de snelheid elke 10 seconden
    setInterval(() => {
        gameSpeed += 0.2;
    }, SPEED_INCREASE_INTERVAL);
}

// Game loop
function gameLoop() {
    // Verwijder oude actieve cellen
    activeCells.forEach(cell => {
        if (cell.timeout) {
            clearTimeout(cell.timeout);
        }
        cell.element.classList.remove('active', 'green', 'red', 'blue', 'yellow');
    });
    
    // Genereer nieuwe actieve cellen
    const numActiveCells = Math.floor(Math.random() * (MAX_ACTIVE_CELLS - MIN_ACTIVE_CELLS + 1)) + MIN_ACTIVE_CELLS;
    activeCells = [];
    
    for (let i = 0; i < numActiveCells; i++) {
        const cellIndex = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
        const cell = grid.children[cellIndex];
        
        // Kies een willekeurige kleur
        const colors = ['green', 'red', 'blue', 'yellow'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        cell.classList.add('active', color);
        
        const timeout = setTimeout(() => {
            cell.classList.remove('active', color);
            if (color === 'green') {
                // Straf voor gemiste groene cellen
                updateScore(-2);
                comboCount = 0;
            }
        }, CELL_ACTIVE_TIME);
        
        activeCells.push({ element: cell, timeout });
    }
}

// Verwerk cell clicks
function handleCellClick(event) {
    const cell = event.target;
    if (!cell.classList.contains('active')) return;
    
    if (cell.classList.contains('green')) {
        // Correcte klik op groene cel
        let points = 10;
        comboCount++;
        
        if (comboCount >= 3) {
            points *= 1.5; // Combo multiplier
        }
        
        updateScore(points);
    } else if (cell.classList.contains('red')) {
        // Straf voor klikken op rode cel
        updateScore(-5);
        comboCount = 0;
    } else {
        // Neutrale klik op blauwe/gele cel
        comboCount = 0;
    }
    
    // Verwijder de cel
    cell.classList.remove('active', 'green', 'red', 'blue', 'yellow');
    const cellIndex = activeCells.findIndex(c => c.element === cell);
    if (cellIndex !== -1) {
        clearTimeout(activeCells[cellIndex].timeout);
        activeCells.splice(cellIndex, 1);
    }
}

// Update de score
function updateScore(points = 0) {
    score += points;
    scoreDisplay.textContent = score;
}

// Update de timer
function updateGameTimer() {
    timeLeft--;
    updateTimer();
    
    if (timeLeft <= 0) {
        endGame();
    }
}

function updateTimer() {
    timerDisplay.textContent = timeLeft;
}

// Eindig het spel
function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    
    gameScreen.classList.remove('active');
    gameOverScreen.classList.add('active');
    finalScoreDisplay.textContent = score;
}

// Valideer de naam
function isNameAllowed(name) {
    const cleanName = name.toLowerCase()
        .replace(/[0-9]/g, (match) => {
            const leetMap = {'0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't'};
            return leetMap[match] || match;
        })
        .replace(/[^a-z]/g, '');
    
    if (BANNED_NAMES.includes(cleanName)) {
        return false;
    }
    
    for (let banned of BANNED_NAMES) {
        if (cleanName.includes(banned)) {
            return false;
        }
    }
    
    if (/(.)\1{3,}/.test(cleanName)) {
        return false;
    }
    
    return true;
}

// Valideer het formulier
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (name.length < 2) {
        alert('Voornaam moet minimaal 2 letters zijn');
        return false;
    }
    
    if (name.length > 15) {
        alert('Voornaam mag maximaal 15 letters zijn');
        return false;
    }
    
    if (!/^[a-zA-ZÀ-ÿ\s-']+$/.test(name)) {
        alert('Voornaam mag alleen letters bevatten');
        return false;
    }
    
    if (!isNameAllowed(name)) {
        alert('Deze naam is niet toegestaan. Kies een andere voornaam.');
        return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Voer een geldig e-mailadres in');
        return false;
    }
    
    return true;
}

// Event listeners
startButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', startGame);
scoreForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (validateForm()) {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (await saveScore(name, email)) {
            alert('Score opgeslagen!');
            startGame();
        } else {
            alert('Er is een fout opgetreden bij het opslaan van je score. Probeer het later opnieuw.');
        }
    }
});

// Laad highscores bij het opstarten
loadHighscores();

// Initialiseer het spel
initGrid();
