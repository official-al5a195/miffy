class GameManager {
    constructor() {
        this.currentGame = null;
        this.gameData = {
            cardmatch: null
        };
    }

    // Card Matching Game
    createCardMatch() {
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="text-center mb-4">
                <h3><i class="fas fa-heart"></i> Love Memory Game</h3>
                <p>Match the pairs of love symbols!</p>
                <div class="mb-3">
                    <button class="btn btn-primary me-2" onclick="gameManager.startCardMatch()">New Game</button>
                    <button class="btn btn-outline-primary" onclick="gameManager.resetCardMatch()">Reset</button>
                </div>
                <div class="row">
                    <div class="col-6">
                        <small>Moves: <span id="card-moves">0</span></small>
                    </div>
                    <div class="col-6">
                        <small>Time: <span id="card-timer">00:00</span></small>
                    </div>
                </div>
            </div>
            <div class="game-board card-match-board" id="card-match-board"></div>
            <div id="card-match-message" class="mt-3 text-center"></div>
        `;
        
        this.currentGame = 'cardmatch';
        this.startCardMatch();
        return container;
    }

    startCardMatch() {
        const board = document.getElementById('card-match-board');
        if (!board) return;
        
        const symbols = ['💕', '💖', '💝', '🌹', '🦋', '🌸', '💐', '🎀'];
        const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
        
        board.innerHTML = '';
        board.style.cssText = `
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            max-width: 400px;
            margin: 0 auto;
        `;
        
        this.gameData.cardmatch = {
            cards: cards,
            flipped: [],
            matched: [],
            moves: 0,
            startTime: Date.now(),
            gameOver: false
        };
        
        cards.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'card-match-card';
            card.dataset.index = index;
            card.style.cssText = `
                aspect-ratio: 1;
                background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                position: relative;
                overflow: hidden;
            `;
            
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            cardBack.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                transition: transform 0.3s ease;
                backface-visibility: hidden;
            `;
            cardBack.textContent = '💗';
            
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            cardFront.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, #ffffff, #f8f9fa);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                transition: transform 0.3s ease;
                transform: rotateY(180deg);
                backface-visibility: hidden;
            `;
            cardFront.textContent = symbol;
            
            card.appendChild(cardBack);
            card.appendChild(cardFront);
            card.addEventListener('click', () => this.flipCard(index));
            
            board.appendChild(card);
        });
        
        document.getElementById('card-moves').textContent = '0';
        document.getElementById('card-timer').textContent = '00:00';
        document.getElementById('card-match-message').innerHTML = '';
        
        this.startCardTimer();
    }

    flipCard(index) {
        const game = this.gameData.cardmatch;
        if (game.gameOver || game.flipped.includes(index) || game.matched.includes(index)) return;
        if (game.flipped.length >= 2) return;
        
        const card = document.querySelector(`[data-index="${index}"]`);
        const cardBack = card.querySelector('.card-back');
        const cardFront = card.querySelector('.card-front');
        
        // Flip animation
        cardBack.style.transform = 'rotateY(-180deg)';
        cardFront.style.transform = 'rotateY(0deg)';
        
        game.flipped.push(index);
        
        if (game.flipped.length === 2) {
            game.moves++;
            document.getElementById('card-moves').textContent = game.moves;
            
            setTimeout(() => this.checkCardMatch(), 800);
        }
    }

    checkCardMatch() {
        const game = this.gameData.cardmatch;
        const [first, second] = game.flipped;
        
        if (game.cards[first] === game.cards[second]) {
            // Match found
            game.matched.push(first, second);
            game.flipped = [];
            
            // Add match animation
            const card1 = document.querySelector(`[data-index="${first}"]`);
            const card2 = document.querySelector(`[data-index="${second}"]`);
            
            [card1, card2].forEach(card => {
                card.style.transform = 'scale(1.1)';
                card.style.boxShadow = '0 0 20px var(--accent-color)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                    card.style.opacity = '0.7';
                }, 200);
            });
            
            // Check if game is complete
            if (game.matched.length === game.cards.length) {
                this.completeCardMatch();
            }
        } else {
            // No match, flip back
            setTimeout(() => {
                [first, second].forEach(index => {
                    const card = document.querySelector(`[data-index="${index}"]`);
                    const cardBack = card.querySelector('.card-back');
                    const cardFront = card.querySelector('.card-front');
                    
                    cardBack.style.transform = 'rotateY(0deg)';
                    cardFront.style.transform = 'rotateY(180deg)';
                });
                
                game.flipped = [];
            }, 500);
        }
    }

    completeCardMatch() {
        const game = this.gameData.cardmatch;
        game.gameOver = true;
        clearInterval(this.cardTimerInterval);
        
        const elapsed = Math.floor((Date.now() - game.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        document.getElementById('card-match-message').innerHTML = `
            <div class="alert alert-success">
                <h5>🎉 Congratulations!</h5>
                <p>Completed in ${game.moves} moves and ${minutes}:${seconds.toString().padStart(2, '0')}!</p>
            </div>
        `;
        
        this.saveGameScore('cardmatch', game.moves, elapsed);
    }

    resetCardMatch() {
        if (this.cardTimerInterval) {
            clearInterval(this.cardTimerInterval);
        }
        this.startCardMatch();
    }

    startCardTimer() {
        const timer = document.getElementById('card-timer');
        if (!timer) return;
        
        const updateTimer = () => {
            if (this.currentGame === 'cardmatch' && this.gameData.cardmatch && !this.gameData.cardmatch.gameOver) {
                const elapsed = Math.floor((Date.now() - this.gameData.cardmatch.startTime) / 1000);
                const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
                const seconds = (elapsed % 60).toString().padStart(2, '0');
                timer.textContent = `${minutes}:${seconds}`;
            }
        };
        
        updateTimer();
        this.cardTimerInterval = setInterval(updateTimer, 1000);
    }

    async saveGameScore(gameType, score, time = 0) {
        try {
            const response = await fetch('/api/save-game-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    game_type: gameType,
                    score: score,
                    time_taken: time
                })
            });
            
            if (response.ok) {
                console.log('Game score saved successfully');
            }
        } catch (error) {
            console.error('Error saving game score:', error);
        }
    }
}

// Initialize game manager
const gameManager = new GameManager();