// Game state
const gameState = {
    score: 0,
    timeLeft: 60,
    isPlaying: false,
    combo: 0, // Combo teller
    speed: 1, // Basis snelheid
    speedIncreaseInterval: 10, // Verhoog snelheid elke 10 seconden
    lastSpeedIncrease: 0, // Tijd van laatste snelheidsverhoging
    highscores: [], // Array voor highscores
    gameLoopInterval: null, // Interval voor game loop
    timerInterval: null // Interval voor timer
};

// DOM Elements
const elements = {
    menuScreen: document.getElementById('menu-screen'),
    countdownScreen: document.getElementById('countdown-screen'),
    gameScreen: document.getElementById('game-screen'),
    gameOverScreen: document.getElementById('game-over-screen'),
    score: document.getElementById('score'),
    time: document.getElementById('time'),
    finalScore: document.getElementById('final-score'),
    grid: document.getElementById('grid'),
    startGame: document.getElementById('start-button'),
    playAgain: document.getElementById('play-again'),
    highscoreForm: document.getElementById('highscore-form'),
    highscoreList: document.getElementById('highscores-list'),
    gameOverHighscoreList: document.getElementById('game-over-highscores')
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

    // Load highscores from localStorage
    loadHighscores();

    // Event listeners
    elements.startGame.addEventListener('click', startGame);
    elements.playAgain.addEventListener('click', resetGame);
    elements.highscoreForm.addEventListener('submit', handleHighscoreSubmit);
}

// Load highscores from localStorage
function loadHighscores() {
    const savedHighscores = localStorage.getItem('highscores');
    gameState.highscores = savedHighscores ? JSON.parse(savedHighscores) : [];
    updateHighscoreDisplay();
}

// Save highscores to localStorage
function saveHighscores() {
    localStorage.setItem('highscores', JSON.stringify(gameState.highscores));
}

// Update highscore display
function updateHighscoreDisplay() {
    const displayHighscores = (container, highlightIndex = -1) => {
        container.innerHTML = '';
        gameState.highscores.slice(0, 10).forEach((entry, index) => {
            const scoreElement = document.createElement('div');
            scoreElement.className = 'highscore-entry';
            if (index === highlightIndex) {
                scoreElement.classList.add('highlighted');
            }
            scoreElement.textContent = `${index + 1}. ${entry.name.padEnd(15, ' ')} - ${entry.score}`;
            container.appendChild(scoreElement);
        });
    };

    displayHighscores(elements.highscoreList);
    displayHighscores(elements.gameOverHighscoreList);
}

// Check if score is in top 10
function isTopTenScore(score) {
    return gameState.highscores.length < 10 || score > gameState.highscores[gameState.highscores.length - 1].score;
}

// Add new highscore
function addHighscore(name, score) {
    const newEntry = { name: name.substring(0, 15), score: score };
    gameState.highscores.push(newEntry);
    gameState.highscores.sort((a, b) => b.score - a.score);
    gameState.highscores = gameState.highscores.slice(0, 10);
    saveHighscores();
    return gameState.highscores.findIndex(entry => entry === newEntry);
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
    const baseInterval = 1500;
    gameState.gameLoopInterval = setInterval(gameLoop, baseInterval);
    
    // Start timer
    gameState.timerInterval = setInterval(updateTimer, 1000);
}

// Game loop
function gameLoop() {
    if (!gameState.isPlaying) return;
    
    // Deactivate all cells first
    Array.from(elements.grid.children).forEach(cell => {
        deactivateCell(cell);
    });
    
    // Activate random cells
    const numCells = Math.floor(Math.random() * 3) + 1; // 1-3 cells
    const availableCells = Array.from(elements.grid.children);
    
    for (let i = 0; i < numCells; i++) {
        if (availableCells.length === 0) break;
        
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const cell = availableCells.splice(randomIndex, 1)[0];
        
        activateCell(cell);
    }
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
}

// Deactivate cell
function deactivateCell(cell) {
    cell.classList.remove('active', 'green', 'red', 'blue', 'yellow');
    cell.dataset.color = '';
}

// Handle cell click
function handleCellClick(cell) {
    if (!gameState.isPlaying || !cell.classList.contains('active')) return;
    
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
            
            // Update game loop interval based on new speed
            clearInterval(gameState.gameLoopInterval);
            const baseInterval = 1500;
            gameState.gameLoopInterval = setInterval(gameLoop, baseInterval / gameState.speed);
        }
    } else {
        endGame();
    }
}

// End game
function endGame() {
    gameState.isPlaying = false;
    
    // Clear all intervals
    clearInterval(gameState.timerInterval);
    clearInterval(gameState.gameLoopInterval);
    
    // Deactivate all cells
    Array.from(elements.grid.children).forEach(cell => {
        deactivateCell(cell);
    });
    
    // Show game over screen
    elements.gameScreen.classList.remove('active');
    elements.gameOverScreen.classList.add('active');
    elements.finalScore.textContent = gameState.score;
    
    // Check if score is in top 10
    if (isTopTenScore(gameState.score)) {
        elements.highscoreForm.style.display = 'block';
    } else {
        elements.highscoreForm.style.display = 'none';
    }
    
    // Update highscore display
    updateHighscoreDisplay();
    
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
function handleHighscoreSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('player-name').value;
    const score = gameState.score;
    
    // Add new highscore
    const newIndex = addHighscore(name, score);
    
    // Update display with highlighted new score
    updateHighscoreDisplay();
    const highlightElement = elements.gameOverHighscoreList.children[newIndex];
    if (highlightElement) {
        highlightElement.classList.add('highlighted');
    }
    
    // Hide form
    elements.highscoreForm.style.display = 'none';
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGame();
}); 