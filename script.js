// Game state
const gameState = {
    grid: [],
    minesCount: 3,
    revealed: 0,
    gameStarted: false
};

// Sound Effects
const sounds = {
    click: new Audio('Button Press Sound 30362.mp3'),
    reveal: new Audio('sounds/reveal.mp3'),
    mine: new Audio('Mine Explosion Results.mp3'),
    win: new Audio('sounds/win.mp3')
};

let soundEnabled = true;

function playSound(soundName) {
    if (soundEnabled && sounds[soundName]) {
        sounds[soundName].currentTime = 0;
        sounds[soundName].play().catch(error => console.log('Sound play failed:', error));
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundButton = document.querySelector('.sound-button');
    soundButton.classList.toggle('sound-off', !soundEnabled);
}

// SVG Icons
const starIcon = '<img src="./STAR.png" alt="Star" class="cell-icon">';

const crossSVG = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="#ff3b3b" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

// DOM Elements
const gameGrid = document.getElementById('gameGrid');
const startButton = document.getElementById('startButton');
const modal = document.getElementById('gameOverModal');
const gameOverText = document.getElementById('gameOverText');
const restartBtn = document.getElementById('restartBtn');
const minesSelect = document.getElementById('minesCount');

// Initialize game
function initializeGame() {
    gameState.grid = [];
    gameState.revealed = 0;
    gameState.gameStarted = false;
    gameGrid.innerHTML = '';
    modal.style.display = 'none';
    
    // Create 5x5 grid
    for (let i = 0; i < 25; i++) {
        const cell = createCell(i);
        gameGrid.appendChild(cell);
        gameState.grid.push({
            element: cell,
            isMine: false,
            isRevealed: false
        });
    }
}

function createCell(index) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = index;
    
    // Create icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'icon-container';
    cell.appendChild(iconContainer);
    
    // Add crack and particle elements
    const crack = document.createElement('div');
    crack.className = 'crack';
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    cell.appendChild(crack);
    cell.appendChild(particle);
    
    cell.addEventListener('click', () => handleCellClick(index));
    return cell;
}

// Place mines randomly
function placeMines() {
    const minePositions = new Set();
    while (minePositions.size < gameState.minesCount) {
        const position = Math.floor(Math.random() * 25);
        minePositions.add(position);
    }
    
    minePositions.forEach(position => {
        gameState.grid[position].isMine = true;
    });
}

// Game over function
function gameOver(isWin) {
    gameState.gameStarted = false;
    gameOverText.textContent = isWin ? 'You Win!' : 'Game Over!';
    modal.style.display = 'flex';
}

function revealAllCells() {
    gameState.grid.forEach((cell, index) => {
        if (!cell.isRevealed) {
            cell.isRevealed = true;
            cell.element.classList.add('revealed');
            
            const iconContainer = cell.element.querySelector('.icon-container');
            if (cell.isMine) {
                iconContainer.innerHTML = crossSVG;
                cell.element.classList.add('mine');
            } else {
                iconContainer.innerHTML = starIcon;
            }
        }
    });
}

// Handle cell click
function handleCellClick(index) {
    if (!gameState.gameStarted || gameState.grid[index].isRevealed) return;
    
    playSound('click');  // Воспроизводим звук клика
    
    const cell = gameState.grid[index];
    cell.isRevealed = true;
    cell.element.classList.add('revealed');
    
    // Add icon
    const iconContainer = cell.element.querySelector('.icon-container');
    if (cell.isMine) {
        iconContainer.innerHTML = crossSVG;
        cell.element.classList.add('mine');
        playSound('mine'); // Play mine explosion sound
        revealAllCells(); // Reveal all cells before showing game over
        gameOver(false);
    } else {
        iconContainer.innerHTML = starIcon;
        gameState.revealed++;
        
        // Check win condition
        if (gameState.revealed === gameState.grid.length - gameState.minesCount) {
            revealAllCells(); // Also reveal all cells on win
            gameOver(true);
        }
    }
}

// Start game
function startGame() {
    modal.style.display = 'none';
    
    // Get selected mines count
    gameState.minesCount = parseInt(minesSelect.value);
    
    gameState.grid = [];
    gameState.revealed = 0;
    gameState.gameStarted = true;
    
    // Clear grid
    gameGrid.innerHTML = '';
    
    // Create new grid
    for (let i = 0; i < 25; i++) {
        gameState.grid.push({
            isMine: false,
            isRevealed: false,
            element: createCell(i)
        });
        gameGrid.appendChild(gameState.grid[i].element);
    }
    
    placeMines();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    startButton.addEventListener('click', () => {
        playSound('click');
        startGame();
    });
    
    restartBtn.addEventListener('click', () => {
        playSound('click');
        startGame();
    });
    
    startGame();
});

// Game navigation
function showMenu() {
    document.querySelectorAll('.game-container').forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById('mainMenu').style.display = 'block';
}

function showGame(gameName) {
    document.getElementById('mainMenu').style.display = 'none';
    document.querySelectorAll('.game-container').forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById(gameName + 'Game').style.display = 'block';
}

// LuckyJet Game Logic
async function getSignal() {
    const signalDisplay = document.getElementById('signalValue');
    if (!signalDisplay) return;

    // Play click sound
    playSound('click');

    // Generate random result between 1.00 and 10.00
    const finalValue = (1 + Math.random() * 9).toFixed(2);
    
    // Start from 1.00
    let currentValue = 1.00;
    
    // Animate the counter
    const duration = 2000; // 2 seconds
    const fps = 30;
    const steps = duration / (1000 / fps);
    const increment = (finalValue - currentValue) / steps;
    
    // Disable button during animation
    const button = document.querySelector('.action-button');
    if (button) button.disabled = true;

    // Animation loop
    function animate() {
        if (currentValue < finalValue) {
            currentValue += increment;
            signalDisplay.textContent = `X${currentValue.toFixed(2)}`;
            requestAnimationFrame(animate);
        } else {
            signalDisplay.textContent = `X${finalValue}`;
            if (button) button.disabled = false;
        }
    }

    // Start with X1.00
    signalDisplay.textContent = 'X1.00';
    animate();
}

// CoinFlip Game Logic
let isFlipping = false;

async function flipCoin() {
    if (isFlipping) return;
    isFlipping = true;
    
    const coin = document.getElementById('coin');
    const resultDisplay = document.getElementById('flipResult');
    if (!coin || !resultDisplay) return;

    // Clear previous result
    resultDisplay.textContent = 'Flipping...';

    // Play click sound
    playSound('click');
    
    // Reset animation
    coin.style.animation = 'none';
    coin.offsetHeight; // Trigger reflow
    
    // Add flip animation
    coin.style.animation = 'flip 3s ease-in-out';
    
    // Random result
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Display result
    resultDisplay.textContent = `Result: ${result.toUpperCase()}!`;
    
    isFlipping = false;
    return result;
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}
`;
document.head.appendChild(style);
