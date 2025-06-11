// Game state
const gameState = {
    score: 0,
    highscore: 0,
    timeLeft: 60,
    isPlaying: false,
    lastClickTime: 0,
    combo: 0, // Combo teller
    speed: 1, // Basis snelheid
    speedIncreaseInterval: 10, // Verhoog snelheid elke 10 seconden
    lastSpeedIncrease: 0 // Tijd van laatste snelheidsverhoging
};

// DOM Elements
const elements = {
    menuScreen: document.getElementById('menu-screen'),
    countdownScreen: document.getElementById('countdown-screen'),
    gameScreen: document.getElementById('game-screen'),
    gameOverScreen: document.getElementById('game-over-screen'),
    score: document.getElementById('score'),
    time: document.getElementById('time'),
    highscore: document.getElementById('highscore'),
    finalScore: document.getElementById('final-score'),
    grid: document.getElementById('grid'),
    startGame: document.getElementById('start-button'),
    playAgain: document.getElementById('play-again'),
    highscoreForm: document.getElementById('highscore-form')
};

// Initialize game
function initGame() {
    // Create grid cells
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(cell));
        elements.grid.appendChild(cell);
    }

    // Update highscore display
    elements.highscore.textContent = gameState.highscore;

    // Event listeners
    elements.startGame.addEventListener('click', startGame);
    elements.playAgain.addEventListener('click', resetGame);
    elements.highscoreForm.addEventListener('submit', handleHighscoreSubmit);
}

// Start game
function startGame() {
    elements.menuScreen.classList.remove('active');
    elements.countdownScreen.classList.add('active');
    
    let count = 3;
    const countdownElement = document.getElementById('countdown');
    
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownElement.textContent = count;
        } else {
            clearInterval(countdownInterval);
            elements.countdownScreen.classList.remove('active');
            elements.gameScreen.classList.add('active');
            startGameplay();
        }
    }, 1000);
}

// Start gameplay
function startGameplay() {
    gameState.isPlaying = true;
    gameState.score = 0;
    gameState.timeLeft = 60;
    gameState.combo = 0;
    gameState.speed = 1;
    gameState.lastSpeedIncrease = 0;
    
    updateDisplay();
    
    // Start game loop
    gameLoop();
    
    // Start timer
    const timerInterval = setInterval(() => {
        updateTimer();
    }, 1000);
}

// Game loop
function gameLoop() {
    if (!gameState.isPlaying) return;
    
    // Activate random cells
    const numCells = Math.floor(Math.random() * 3) + 1; // 1-3 cells
    const availableCells = Array.from(elements.grid.children)
        .filter(cell => !cell.dataset.color);
    
    for (let i = 0; i < numCells; i++) {
        if (availableCells.length === 0) break;
        
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const cell = availableCells.splice(randomIndex, 1)[0];
        
        activateCell(cell);
    }
    
    // Schedule next game loop with speed adjustment
    const baseInterval = 1500;
    const nextInterval = baseInterval / gameState.speed;
    
    setTimeout(gameLoop, nextInterval);
}

// Activate cell
function activateCell(cell) {
    const colors = ['green', 'red', 'blue', 'yellow'];
    const weights = [0.4, 0.3, 0.15, 0.15]; // 40% green, 30% red, 15% blue, 15% yellow
    
    // Weighted random color selection
    const random = Math.random();
    let sum = 0;
    let selectedColor;
    
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (random < sum) {
            selectedColor = colors[i];
            break;
        }
    }
    
    cell.classList.add('active', selectedColor);
    cell.dataset.color = selectedColor;
    
    // Deactivate cell after 1.5 seconds
    setTimeout(() => {
        if (cell.classList.contains('active')) {
            deactivateCell(cell);
            if (selectedColor === 'green') {
                // Penalty for missing green cell
                gameState.score = Math.max(0, gameState.score - 2);
                gameState.combo = 0;
                updateDisplay();
            }
        }
    }, 1500);
}

// Deactivate cell
function deactivateCell(cell) {
    cell.classList.remove('active', 'green', 'red', 'blue', 'yellow');
    cell.dataset.color = '';
}

// Handle cell click
function handleCellClick(cell) {
    if (!cell.classList.contains('active')) return;
    
    const color = cell.dataset.color;
    
    if (color === 'green') {
        gameState.combo++;
        const multiplier = gameState.combo >= 3 ? 1.5 : 1;
        gameState.score += Math.floor(10 * multiplier);
    } else if (color === 'red') {
        gameState.score = Math.max(0, gameState.score - 5);
        gameState.combo = 0;
    }
    // Blue and yellow cells are just distractions, no points
    
    // Deactivate cell
    deactivateCell(cell);
    
    updateDisplay();
}

// Update display
function updateDisplay() {
    elements.score.textContent = gameState.score;
    elements.time.textContent = gameState.timeLeft;
}

// Update timer
function updateTimer() {
    if (gameState.timeLeft > 0) {
        gameState.timeLeft--;
        elements.time.textContent = gameState.timeLeft;
        
        // Increase speed every 10 seconds
        if (gameState.timeLeft % gameState.speedIncreaseInterval === 0 && 
            gameState.timeLeft !== gameState.lastSpeedIncrease) {
            gameState.speed += 0.2; // Increase speed by 20%
            gameState.lastSpeedIncrease = gameState.timeLeft;
        }
    } else {
        endGame();
    }
}

// End game
function endGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);
    
    // Update highscore
    if (gameState.score > gameState.highscore) {
        gameState.highscore = gameState.score;
        localStorage.setItem('highscore', gameState.highscore);
    }
    
    // Show game over screen
    elements.gameScreen.classList.remove('active');
    elements.gameOverScreen.classList.add('active');
    elements.finalScore.textContent = gameState.score;
    elements.highscore.textContent = gameState.highscore;
    
    // Reset game state
    gameState.timeLeft = 60;
    gameState.score = 0;
}

// Reset game
function resetGame() {
    elements.gameOverScreen.classList.remove('active');
    elements.menuScreen.classList.add('active');
}

// Handle highscore submission
async function handleHighscoreSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('player-name').value;
    const email = document.getElementById('player-email').value;
    
    // Disable form while submitting
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Bezig met versturen...';
    
    try {
        // Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxyJ3QPoE-SArYlC1bM_MOuBdl-eOLT1n7n6w3-7og7GEChYmyUnhg787I2420XOfUWLQ/exec';
        
        // Data als URL parameters
        const params = new URLSearchParams({
            name: name,
            email: email,
            score: gameState.score,
            highscore: gameState.highscore
        });
        
        const response = await fetch(`${scriptURL}?${params.toString()}`, {
            method: 'POST',
            mode: 'no-cors', // Belangrijk voor CORS
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        
        // Omdat we 'no-cors' gebruiken, kunnen we de response niet checken
        // We gaan ervan uit dat het succesvol was als er geen error is
        
        // Toon succes bericht
        const gameOverContent = document.querySelector('.game-over-content');
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <p>Bedankt! Je score is opgeslagen.</p>
            <p>We nemen contact met je op over onze groene opleidingen!</p>
        `;
        gameOverContent.insertBefore(successMessage, gameOverContent.firstChild);
        
        // Reset form
        e.target.reset();
        
        // Reset game na 3 seconden
        setTimeout(resetGame, 3000);
        
        // Update highscores na succesvolle submit
        await updateHighscores();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Er ging iets mis bij het versturen van je score. Probeer het later opnieuw.');
    } finally {
        // Re-enable form
        submitButton.disabled = false;
        submitButton.textContent = 'Verstuur Score';
    }
}

// Callback functie voor JSONP
function handleHighscoresResponse(data) {
    if (data.status === 'success' && data.data) {
        console.log('Received highscores:', data.data);
        // Cache de highscores in localStorage
        localStorage.setItem('cachedHighscores', JSON.stringify(data.data));
        displayHighscores(data.data, 'highscores-list');
        displayHighscores(data.data, 'game-over-highscores');
    }
}

// Haal highscores op met JSONP
function fetchHighscores() {
    return new Promise((resolve, reject) => {
        try {
            // Google Apps Script Web App URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwm2r6nS15RH_arq5Z5o_7kMBYe1RZ0AGVtQmb7JHgNo0DAfjwk_6ayW6hpbkhSgP65Zg/exec';
            
            // Maak een script element
            const script = document.createElement('script');
            script.src = `${scriptURL}?action=getHighscores&callback=handleHighscoresResponse`;
            
            // Voeg error handling toe
            script.onerror = () => {
                console.error('Error loading highscores');
                // Fallback naar gecachte highscores
                const cachedHighscores = localStorage.getItem('cachedHighscores');
                if (cachedHighscores) {
                    const data = JSON.parse(cachedHighscores);
                    displayHighscores(data, 'highscores-list');
                    displayHighscores(data, 'game-over-highscores');
                }
                reject(new Error('Failed to load highscores'));
            };
            
            // Voeg het script toe aan de pagina
            document.body.appendChild(script);
            
            // Verwijder het script element na gebruik
            script.onload = () => {
                document.body.removeChild(script);
                resolve();
            };
        } catch (error) {
            console.error('Error fetching highscores:', error);
            // Fallback naar gecachte highscores
            const cachedHighscores = localStorage.getItem('cachedHighscores');
            if (cachedHighscores) {
                const data = JSON.parse(cachedHighscores);
                displayHighscores(data, 'highscores-list');
                displayHighscores(data, 'game-over-highscores');
            }
            reject(error);
        }
    });
}

// Toon highscores
function displayHighscores(highscores, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!highscores || highscores.length === 0) {
        container.innerHTML = '<div class="loading">Nog geen highscores</div>';
        return;
    }

    // Sorteer highscores op score (hoog naar laag)
    highscores.sort((a, b) => b.score - a.score);
    
    // Neem top 10
    const top10 = highscores.slice(0, 10);

    container.innerHTML = top10.map((score, index) => `
        <div class="highscore-item">
            <span class="highscore-rank">#${index + 1}</span>
            <span class="highscore-name">${score.name}</span>
            <span class="highscore-score">${score.score}</span>
        </div>
    `).join('');
}

// Update highscores op beide schermen
async function updateHighscores() {
    await fetchHighscores();
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    updateHighscores();
}); 