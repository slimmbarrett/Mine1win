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
    document.querySelectorAll('.game-container').forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById('mainMenu').style.display = 'none';
    
    if (gameName === 'mines') {
        document.getElementById('minesGame').style.display = 'block';
        initializeGame();
    } else if (gameName === 'luckyjet') {
        document.getElementById('luckyjetGame').style.display = 'block';
    } else if (gameName === 'coinflip') {
        document.getElementById('coinflipGame').style.display = 'block';
    }
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
function getSignal() {
    const signalDisplay = document.getElementById('signalDisplay');
    const plane = document.getElementById('luckyjetPlane');
    signalDisplay.textContent = 'X1.00';
    
    // Add extra animation to plane during signal
    plane.style.animation = 'none';
    plane.offsetHeight; // Trigger reflow
    plane.style.animation = 'fly 1s ease-in-out infinite';
    
    // Disable button during calculation
    const button = document.querySelector('.signal-button');
    button.disabled = true;
    
    let currentValue = 1.00;
    const finalValue = (Math.random() * 2 + 1.5).toFixed(2); // Random number between 1.50 and 3.50
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;
    const valueIncrement = (parseFloat(finalValue) - currentValue) / steps;
    
    const interval = setInterval(() => {
        currentValue += valueIncrement;
        if (currentValue >= parseFloat(finalValue)) {
            clearInterval(interval);
            currentValue = parseFloat(finalValue);
            playSound('click');
            button.disabled = false;
            // Return plane to normal animation
            plane.style.animation = 'fly 2s ease-in-out infinite';
        }
        signalDisplay.textContent = `X${currentValue.toFixed(2)}`;
    }, stepDuration);
}

// CoinFlip Game Logic
let isFlipping = false;

function flipCoin() {
    if (isFlipping) return;
    
    const coin = document.getElementById('coin');
    const flipButton = document.querySelector('.flip-button');
    const resultDisplay = document.getElementById('flipResult');
    
    isFlipping = true;
    flipButton.disabled = true;
    resultDisplay.textContent = '';
    resultDisplay.classList.remove('show');
    
    playSound('click');
    
    // Random number of rotations between 5 and 10
    const rotations = 5 + Math.floor(Math.random() * 5);
    const isHeads = Math.random() > 0.5;
    
    // Add flipping animation
    coin.style.animation = 'none';
    coin.offsetHeight; // Trigger reflow
    coin.style.animation = `flip-${isHeads ? 'heads' : 'tails'} 3s ease-out forwards`;
    
    // Show result after animation
    setTimeout(() => {
        resultDisplay.textContent = isHeads ? 'HEADS!' : 'TAILS!';
        resultDisplay.classList.add('show');
        isFlipping = false;
        flipButton.disabled = false;
        playSound(isHeads ? 'win' : 'reveal');
    }, 3000);
}

// Add CSS animation for coin flip
const style = document.createElement('style');
style.textContent = `
@keyframes flip-heads {
    0% { transform: rotateX(0); }
    100% { transform: rotateX(${360 * 5}deg); }
}

@keyframes flip-tails {
    0% { transform: rotateX(0); }
    100% { transform: rotateX(${360 * 5 + 180}deg); }
}

.coin {
    position: relative;
    width: 150px;
    height: 150px;
    transform-style: preserve-3d;
    transition: transform 0.5s ease-out;
}

.coin .heads,
.coin .tails {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.coin .heads img,
.coin .tails img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.coin .tails {
    transform: rotateX(180deg);
}

.signal-display {
    background: rgba(0, 0, 0, 0.7);
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    font-size: 1.2em;
    text-align: center;
    white-space: pre-line;
}

.signal-button:disabled,
.flip-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
`;

document.head.appendChild(style);

// Language selection and translations
const translations = {
    ru: {
        subscribeTitle: 'Подпишитесь на наш Telegram канал',
        joinChannel: 'Присоединиться к каналу',
        enterUsername: 'Введите ваш Telegram username',
        verifyButton: 'Проверить подписку',
        registerTitle: 'Зарегистрируйтесь для игры',
        registerNow: 'Зарегистрироваться',
        enterPlayerId: 'Введите ваш ID игрока',
        verifyId: 'Проверить ID',
        backToMenu: 'Назад в меню',
        gameOver: 'Игра окончена!',
        playAgain: 'Играть снова'
    },
    en: {
        subscribeTitle: 'Subscribe to our Telegram Channel',
        joinChannel: 'Join Channel',
        enterUsername: 'Enter your Telegram username',
        verifyButton: 'Verify Subscription',
        registerTitle: 'Register to Play',
        registerNow: 'Register Now',
        enterPlayerId: 'Enter your Player ID',
        verifyId: 'Verify ID',
        backToMenu: 'Back to Menu',
        gameOver: 'Game Over!',
        playAgain: 'Play Again'
    },
    in: {
        subscribeTitle: 'हमारे टेलीग्राम चैनल को सब्सक्राइब करें',
        joinChannel: 'चैनल से जुड़ें',
        enterUsername: 'अपना टेलीग्राम यूजरनेम दर्ज करें',
        verifyButton: 'सब्सक्रिप्शन सत्यापित करें',
        registerTitle: 'खेलने के लिए रजिस्टर करें',
        registerNow: 'अभी रजिस्टर करें',
        enterPlayerId: 'अपना प्लेयर आईडी दर्ज करें',
        verifyId: 'आईडी सत्यापित करें',
        backToMenu: 'मेनू पर वापस जाएं',
        gameOver: 'खेल समाप्त!',
        playAgain: 'फिर से खेलें'
    }
};

let currentLanguage = 'en';

// Initialize language selection
document.addEventListener('DOMContentLoaded', () => {
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            setLanguage(lang);
            document.getElementById('languageSelection').style.display = 'none';
            document.getElementById('subscriptionStep').style.display = 'block';
            updateTranslations();
        });
    });
});

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
}

function updateTranslations() {
    const trans = translations[currentLanguage];
    
    // Update subscription step
    document.getElementById('subscribeTitle').textContent = trans.subscribeTitle;
    document.querySelector('.telegram-button').textContent = trans.joinChannel;
    document.getElementById('telegramUsername').placeholder = trans.enterUsername;
    document.querySelector('.verify-button').textContent = trans.verifyButton;
    
    // Update registration step
    document.getElementById('registerTitle').textContent = trans.registerTitle;
    document.querySelector('.register-button').textContent = trans.registerNow;
    document.getElementById('playerId').placeholder = trans.enterPlayerId;
    document.querySelectorAll('.verify-button')[1].textContent = trans.verifyId;
    
    // Update game elements
    document.querySelectorAll('.back-button').forEach(btn => {
        btn.textContent = trans.backToMenu;
    });
    document.getElementById('gameOverText').textContent = trans.gameOver;
    document.getElementById('restartBtn').textContent = trans.playAgain;
}

// Language translations
const translationsOld = {
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
    document.getElementById('channelBtn').textContent = translationsOld[currentLang].channel;
    document.getElementById('subscribedBtn').textContent = translationsOld[currentLang].subscribed;
    document.getElementById('registrationBtn').textContent = translationsOld[currentLang].registration;
    document.getElementById('verifyBtn').textContent = translationsOld[currentLang].verify;
    document.getElementById('submitIdBtn').textContent = translationsOld[currentLang].confirm;
    
    // Game buttons
    document.getElementById('startButton').textContent = translationsOld[currentLang].startGame;
    document.getElementById('restartBtn').textContent = translationsOld[currentLang].playAgain;
    
    // Back buttons
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.textContent = translationsOld[currentLang].back;
    });

    // Update other game-specific buttons
    const signalButton = document.querySelector('.signal-button');
    if (signalButton) signalButton.textContent = translationsOld[currentLang].getSignal;

    const flipButton = document.querySelector('.flip-button');
    if (flipButton) flipButton.textContent = translationsOld[currentLang].flipCoin;
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
        updateMessageText(telegramStep.querySelector('.message-text'), translationsOld[currentLang].welcome);

        // Channel button
        document.getElementById('channelBtn').addEventListener('click', () => {
            window.open('https://t.me/+-OM0Pl6Ow_I2ZmM0', '_blank');
        });

        // Subscribed button
        document.getElementById('subscribedBtn').addEventListener('click', () => {
            telegramStep.style.display = 'none';
            referralStep.style.display = 'block';
            updateMessageText(referralStep.querySelector('.message-text'), translationsOld[currentLang].referral);
        });

        // Registration button
        document.getElementById('registrationBtn').addEventListener('click', () => {
            window.open('https://1wxxlb.com/casino/list?open=register&p=dsgq', '_blank');
        });

        // Verify button
        document.getElementById('verifyBtn').addEventListener('click', () => {
            referralStep.style.display = 'none';
            idVerificationStep.style.display = 'block';
            idVerificationStep.querySelector('.message-text').textContent = translationsOld[currentLang].enterId;
        });

        // ID verification
        document.getElementById('submitIdBtn').addEventListener('click', () => {
            const playerId = document.getElementById('playerId').value;
            if (playerId.length === 8 && /^\d+$/.test(playerId)) {
                alert(translationsOld[currentLang].thanks);
                subscriptionFlow.style.display = 'none';
                gameContent.style.display = 'block';
            } else {
                alert(translationsOld[currentLang].enterId);
            }
        });
    }
});

// Subscription verification
async function verifySubscription() {
    const telegramInput = document.getElementById('telegramUsername');
    const username = telegramInput.value.trim();
    
    if (!username) {
        showError('Please enter your Telegram username');
        return;
    }

    // Show loading state
    const verifyButton = document.querySelector('.verify-button');
    const originalText = verifyButton.textContent;
    verifyButton.disabled = true;
    verifyButton.textContent = 'Verifying...';

    try {
        // Get user info first
        const userInfo = await TelegramAPI.getTelegramUserInfo(username);
        
        if (!userInfo) {
            showError('Invalid Telegram username');
            return;
        }

        // Check subscription
        const isSubscribed = await TelegramAPI.checkSubscription(userInfo.id);
        
        if (isSubscribed) {
            // Save verification status
            localStorage.setItem('telegramVerified', 'true');
            localStorage.setItem('telegramUsername', username);
            
            // Proceed to next step
            showRegistrationStep();
        } else {
            showError('Please subscribe to our Telegram channel first');
        }
    } catch (error) {
        console.error('Verification error:', error);
        showError('Failed to verify subscription. Please try again.');
    } finally {
        // Reset button state
        verifyButton.disabled = false;
        verifyButton.textContent = originalText;
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const verifyButton = document.querySelector('.verify-button');
    verifyButton.parentNode.insertBefore(errorDiv, verifyButton.nextSibling);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}
