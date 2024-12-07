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
const starIcon = '<img src="./STAR2.png" alt="Star" class="cell-icon">';

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

// Navigation functions
function showLanguageSelection() {
    document.getElementById('subscriptionFlow').style.display = 'none';
    document.getElementById('languageSelection').style.display = 'flex';
}

function showTelegramStep() {
    document.getElementById('referralStep').style.display = 'none';
    document.getElementById('telegramStep').style.display = 'block';
}

function showReferralStep() {
    document.getElementById('idVerificationStep').style.display = 'none';
    document.getElementById('referralStep').style.display = 'block';
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

// Language translations
const translations = {
    ru: {
        welcome: "Привет!\n🚩Обязательно подпишитесь на наш Telegram-канал, чтобы всегда получать актуальные уведомления от бота!\n\n🔔 Это поможет не пропустить ни одного важного сигнала! 🚀",
        referral: "🎉 Вот реферальная ссылка на нашего партнера! 🎉\n\n🚨 Важное предупреждение!🚨\n\nЕсли вы не зарегистрируетесь по этой ссылке, бот может показывать неверные результаты! ⚠️\n\nНЕ ЗАБУДЬ УКАЗАТЬ ПРОМОКОД - <span class='promo-code'>CashGen</span> 💸",
        enterId: "Введите свой ID",
        thanks: "Спасибо за регистрацию!",
        channel: "Канал",
        subscribed: "Подписался!",
        registration: "Регистрация",
        verify: "Проверка",
        confirm: "Подтвердить",
        back: "Назад",
        startGame: "Начать игру",
        playAgain: "Играть снова",
        getSignal: "Получить сигнал",
        flipCoin: "Бросить монету"
    },
    en: {
        welcome: "Hello!\n🚩Be sure to subscribe to our Telegram channel to always receive up-to-date notifications from the bot!\n\n🔔 This will help you not miss any important signals! 🚀",
        referral: "🎉 Here's the referral link to our partner! 🎉\n\n🚨 Important warning!🚨\n\nIf you don't register using this link, the bot may show incorrect results! ⚠️\n\nDON'T FORGET TO USE PROMO CODE - <span class='promo-code'>CashGen</span> 💸",
        enterId: "Enter your ID",
        thanks: "Thanks for registering!",
        channel: "Channel",
        subscribed: "Subscribed!",
        registration: "Registration",
        verify: "Verify",
        confirm: "Confirm",
        back: "Back",
        startGame: "Start Game",
        playAgain: "Play Again",
        getSignal: "Get Signal",
        flipCoin: "Flip Coin"
    },
    in: {
        welcome: "नमस्ते!\n🚩बॉट से हमेशा अप-टू-डेट नोटिफिकेशन प्राप्त करने के लिए हमारे टेलीग्राम चैनल को सब्सक्राइब करना सुनिश्चित करें!\n\n🔔 यह आपको किसी भी महत्वपूर्ण सिग्नल को मिस नहीं करने में मदद करेगा! 🚀",
        referral: "🎉 यहाँ हमारे पार्टनर का रेफरल लिंक है! 🎉\n\n🚨 महत्वपूर्ण चेतावनी!🚨\n\nयदि आप इस लिंक का उपयोग करके रजिस्टर नहीं करते हैं, तो बॉट गलत परिणाम दिखा सकता है! ⚠️\n\nप्रोमो कोड भूलना मत - <span class='promo-code'>CashGen</span> 💸",
        enterId: "अपना ID दर्ज करें",
        thanks: "पंजीकरण के लिए धन्यवाद!",
        channel: "चैनल",
        subscribed: "सब्सक्राइब किया!",
        registration: "पंजीकरण",
        verify: "सत्यापन",
        confirm: "पुष्टि करें",
        back: "वापस",
        startGame: "खेल शुरू करें",
        playAgain: "फिर से खेलें",
        getSignal: "सिग्नल प्राप्त करें",
        flipCoin: "सिक्का उछालें"
    }
};

let currentLang = 'ru';

// Update all button texts based on selected language
function updateButtonTexts() {
    // Subscription flow buttons
    document.getElementById('channelBtn').textContent = translations[currentLang].channel;
    document.getElementById('subscribedBtn').textContent = translations[currentLang].subscribed;
    document.getElementById('registrationBtn').textContent = translations[currentLang].registration;
    document.getElementById('verifyBtn').textContent = translations[currentLang].verify;
    document.getElementById('submitIdBtn').textContent = translations[currentLang].confirm;
    
    // Game buttons
    document.getElementById('startButton').textContent = translations[currentLang].startGame;
    document.getElementById('restartBtn').textContent = translations[currentLang].playAgain;
    
    // Back buttons
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.textContent = translations[currentLang].back;
    });

    // Update other game-specific buttons
    const signalButton = document.querySelector('.signal-button');
    if (signalButton) signalButton.textContent = translations[currentLang].getSignal;

    const flipButton = document.querySelector('.flip-button');
    if (flipButton) flipButton.textContent = translations[currentLang].flipCoin;
}

// Update message text with HTML support
function updateMessageText(element, text) {
    if (element) {
        element.innerHTML = text; // Changed from textContent to innerHTML to support HTML tags
    }
}

// Initialize language selection
document.addEventListener('DOMContentLoaded', () => {
    const gameContent = document.getElementById('gameContent');
    const languageSelection = document.getElementById('languageSelection');
    const subscriptionFlow = document.getElementById('subscriptionFlow');
    
    // Language selection handlers
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', () => {
            currentLang = option.dataset.lang;
            languageSelection.style.display = 'none';
            subscriptionFlow.style.display = 'block';
            startSubscriptionFlow();
            updateButtonTexts(); // Update all button texts when language is selected
        });
    });

    // Subscription flow
    function startSubscriptionFlow() {
        const telegramStep = document.getElementById('telegramStep');
        const referralStep = document.getElementById('referralStep');
        const idVerificationStep = document.getElementById('idVerificationStep');

        // Set initial message
        updateMessageText(telegramStep.querySelector('.message-text'), translations[currentLang].welcome);

        // Channel button
        document.getElementById('channelBtn').addEventListener('click', () => {
            window.open('https://t.me/+-OM0Pl6Ow_I2ZmM0', '_blank');
        });

        // Subscribed button
        document.getElementById('subscribedBtn').addEventListener('click', () => {
            telegramStep.style.display = 'none';
            referralStep.style.display = 'block';
            updateMessageText(referralStep.querySelector('.message-text'), translations[currentLang].referral);
        });

        // Registration button
        document.getElementById('registrationBtn').addEventListener('click', () => {
            window.open('https://1wxxlb.com/casino/list?open=register&p=dsgq', '_blank');
        });

        // Verify button
        document.getElementById('verifyBtn').addEventListener('click', () => {
            referralStep.style.display = 'none';
            idVerificationStep.style.display = 'block';
            idVerificationStep.querySelector('.message-text').textContent = translations[currentLang].enterId;
        });

        // ID verification
        document.getElementById('submitIdBtn').addEventListener('click', () => {
            const playerId = document.getElementById('playerId').value;
            if (playerId.length === 8 && /^\d+$/.test(playerId)) {
                alert(translations[currentLang].thanks);
                subscriptionFlow.style.display = 'none';
                gameContent.style.display = 'block';
            } else {
                alert(translations[currentLang].enterId);
            }
        });
    }
});
