class GameManager {
    constructor() {
        this.currentGame = null;
        this.gameData = {
            sudoku: null,
            tictactoe: null,
            cardmatch: null
        };
    }

    // Sudoku Game
    createSudoku() {
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="text-center mb-4">
                <h3><i class="fas fa-th"></i> Sudoku</h3>
                <p>Fill the 9×9 grid with digits 1-9</p>
                <div class="mb-3">
                    <button class="btn btn-primary me-2" onclick="gameManager.generateSudoku()">New Game</button>
                    <button class="btn btn-outline-primary me-2" onclick="gameManager.checkSudoku()">Check</button>
                    <button class="btn btn-outline-secondary" onclick="gameManager.solveSudoku()">Solve</button>
                </div>
                <div>Time: <span id="sudoku-timer">00:00</span></div>
            </div>
            <div class="game-board sudoku-board" id="sudoku-board"></div>
            <div id="sudoku-message" class="mt-3 text-center"></div>
        `;
        
        this.currentGame = 'sudoku';
        this.generateSudoku();
        return container;
    }

    generateSudoku() {
        const board = document.getElementById('sudoku-board');
        if (!board) return;
        
        // Create a simple Sudoku puzzle
        const puzzle = this.createSudokuPuzzle();
        board.innerHTML = '';
        
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.className = 'game-cell sudoku-cell';
            cell.style.cssText = `
                text-align: center;
                font-size: 1.2rem;
                font-weight: bold;
            `;
            
            const value = puzzle[i];
            if (value !== 0) {
                cell.value = value;
                cell.readOnly = true;
                cell.style.background = '#f0f0f0';
                cell.style.fontWeight = 'bold';
            }
            
            cell.addEventListener('input', (e) => {
                const val = e.target.value;
                if (val && (isNaN(val) || val < 1 || val > 9)) {
                    e.target.value = '';
                }
            });
            
            board.appendChild(cell);
        }
        
        this.gameData.sudoku = { puzzle, startTime: Date.now() };
        this.startSudokuTimer();
    }

    createSudokuPuzzle() {
        // Simple Sudoku puzzle (you can expand this)
        return [
            5, 3, 0, 0, 7, 0, 0, 0, 0,
            6, 0, 0, 1, 9, 5, 0, 0, 0,
            0, 9, 8, 0, 0, 0, 0, 6, 0,
            8, 0, 0, 0, 6, 0, 0, 0, 3,
            4, 0, 0, 8, 0, 3, 0, 0, 1,
            7, 0, 0, 0, 2, 0, 0, 0, 6,
            0, 6, 0, 0, 0, 0, 2, 8, 0,
            0, 0, 0, 4, 1, 9, 0, 0, 5,
            0, 0, 0, 0, 8, 0, 0, 7, 9
        ];
    }

    startSudokuTimer() {
        const timer = document.getElementById('sudoku-timer');
        if (!timer) return;
        
        const updateTimer = () => {
            if (this.currentGame === 'sudoku' && this.gameData.sudoku) {
                const elapsed = Math.floor((Date.now() - this.gameData.sudoku.startTime) / 1000);
                const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
                const seconds = (elapsed % 60).toString().padStart(2, '0');
                timer.textContent = `${minutes}:${seconds}`;
            }
        };
        
        updateTimer();
        this.sudokuTimerInterval = setInterval(updateTimer, 1000);
    }

    checkSudoku() {
        const cells = document.querySelectorAll('.sudoku-cell');
        const board = Array.from(cells).map(cell => parseInt(cell.value) || 0);
        
        if (this.isValidSudoku(board)) {
            const elapsed = Math.floor((Date.now() - this.gameData.sudoku.startTime) / 1000);
            document.getElementById('sudoku-message').innerHTML = 
                `<div class="alert alert-success">Congratulations! Completed in ${elapsed} seconds!</div>`;
            this.saveGameScore('sudoku', elapsed);
            clearInterval(this.sudokuTimerInterval);
        } else {
            document.getElementById('sudoku-message').innerHTML = 
                `<div class="alert alert-warning">Not quite right yet. Keep trying!</div>`;
        }
    }

    isValidSudoku(board) {
        // Check if Sudoku is valid and complete
        for (let i = 0; i < 81; i++) {
            if (board[i] === 0) return false;
        }
        
        // Check rows, columns, and 3x3 boxes
        for (let i = 0; i < 9; i++) {
            if (!this.isValidGroup(this.getRow(board, i)) ||
                !this.isValidGroup(this.getCol(board, i)) ||
                !this.isValidGroup(this.getBox(board, i))) {
                return false;
            }
        }
        return true;
    }

    isValidGroup(group) {
        const sorted = group.sort();
        for (let i = 0; i < 9; i++) {
            if (sorted[i] !== i + 1) return false;
        }
        return true;
    }

    getRow(board, row) {
        return board.slice(row * 9, (row + 1) * 9);
    }

    getCol(board, col) {
        const result = [];
        for (let i = 0; i < 9; i++) {
            result.push(board[i * 9 + col]);
        }
        return result;
    }

    getBox(board, box) {
        const result = [];
        const startRow = Math.floor(box / 3) * 3;
        const startCol = (box % 3) * 3;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result.push(board[(startRow + i) * 9 + startCol + j]);
            }
        }
        return result;
    }

    solveSudoku() {
        // Simple solve by filling in the solution
        const solution = [
            5, 3, 4, 6, 7, 8, 9, 1, 2,
            6, 7, 2, 1, 9, 5, 3, 4, 8,
            1, 9, 8, 3, 4, 2, 5, 6, 7,
            8, 5, 9, 7, 6, 1, 4, 2, 3,
            4, 2, 6, 8, 5, 3, 7, 9, 1,
            7, 1, 3, 9, 2, 4, 8, 5, 6,
            9, 6, 1, 5, 3, 7, 2, 8, 4,
            2, 8, 7, 4, 1, 9, 6, 3, 5,
            3, 4, 5, 2, 8, 6, 1, 7, 9
        ];
        
        const cells = document.querySelectorAll('.sudoku-cell');
        cells.forEach((cell, index) => {
            if (!cell.readOnly) {
                cell.value = solution[index];
            }
        });
    }

    // Tic-Tac-Toe Game
    createTicTacToe() {
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="text-center mb-4">
                <h3><i class="fas fa-times"></i> Tic-Tac-Toe</h3>
                <p>Get three in a row!</p>
                <div class="mb-3">
                    <button class="btn btn-primary" onclick="gameManager.resetTicTacToe()">New Game</button>
                </div>
                <div>Current Player: <span id="current-player">X</span></div>
            </div>
            <div class="game-board tictactoe-board" id="tictactoe-board"></div>
            <div id="tictactoe-message" class="mt-3 text-center"></div>
        `;
        
        this.currentGame = 'tictactoe';
        this.resetTicTacToe();
        return container;
    }

    resetTicTacToe() {
        const board = document.getElementById('tictactoe-board');
        if (!board) return;
        
        board.innerHTML = '';
        this.gameData.tictactoe = {
            board: Array(9).fill(''),
            currentPlayer: 'X',
            gameOver: false
        };
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'game-cell tictactoe-cell';
            cell.style.cssText = `
                font-size: 2rem;
                cursor: pointer;
                min-height: 80px;
            `;
            cell.addEventListener('click', () => this.makeTicTacToeMove(i));
            board.appendChild(cell);
        }
        
        document.getElementById('current-player').textContent = 'X';
        document.getElementById('tictactoe-message').innerHTML = '';
    }

    makeTicTacToeMove(index) {
        const game = this.gameData.tictactoe;
        if (game.gameOver || game.board[index] !== '') return;
        
        game.board[index] = game.currentPlayer;
        const cells = document.querySelectorAll('.tictactoe-cell');
        cells[index].textContent = game.currentPlayer;
        cells[index].style.color = game.currentPlayer === 'X' ? '#007bff' : '#dc3545';
        
        if (this.checkTicTacToeWin()) {
            game.gameOver = true;
            document.getElementById('tictactoe-message').innerHTML = 
                `<div class="alert alert-success">Player ${game.currentPlayer} wins!</div>`;
            this.saveGameScore('tictactoe', game.currentPlayer === 'X' ? 1 : 0);
        } else if (game.board.every(cell => cell !== '')) {
            game.gameOver = true;
            document.getElementById('tictactoe-message').innerHTML = 
                `<div class="alert alert-info">It's a tie!</div>`;
        } else {
            game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('current-player').textContent = game.currentPlayer;
            
            // Simple AI for O
            if (game.currentPlayer === 'O' && !game.gameOver) {
                setTimeout(() => this.makeAIMove(), 500);
            }
        }
    }

    makeAIMove() {
        const game = this.gameData.tictactoe;
        const availableMoves = game.board.map((cell, index) => cell === '' ? index : null)
                                       .filter(index => index !== null);
        
        if (availableMoves.length > 0) {
            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            this.makeTicTacToeMove(randomMove);
        }
    }

    checkTicTacToeWin() {
        const board = this.gameData.tictactoe.board;
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];
        
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board[a] !== '' && board[a] === board[b] && board[b] === board[c];
        });
    }

    // Card Matching Game
    createCardMatch() {
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="text-center mb-4">
                <h3><i class="fas fa-cards-blank"></i> Card Matching</h3>
                <p>Find all the matching pairs!</p>
                <div class="mb-3">
                    <button class="btn btn-primary" onclick="gameManager.resetCardMatch()">New Game</button>
                </div>
                <div>
                    Moves: <span id="card-moves">0</span> | 
                    Pairs: <span id="card-pairs">0/8</span> |
                    Time: <span id="card-timer">00:00</span>
                </div>
            </div>
            <div class="game-board cardmatch-board" id="cardmatch-board"></div>
            <div id="cardmatch-message" class="mt-3 text-center"></div>
        `;
        
        this.currentGame = 'cardmatch';
        this.resetCardMatch();
        return container;
    }

    resetCardMatch() {
        const board = document.getElementById('cardmatch-board');
        if (!board) return;
        
        const symbols = ['🌸', '🌺', '🌼', '🌻', '🌷', '🌹', '🦋', '🐝'];
        const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
        
        board.innerHTML = '';
        this.gameData.cardmatch = {
            cards,
            flipped: [],
            matched: [],
            moves: 0,
            pairs: 0,
            startTime: Date.now()
        };
        
        cards.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'game-cell card-cell';
            card.style.cssText = `
                font-size: 2rem;
                cursor: pointer;
                min-height: 80px;
                background: #007bff;
                color: transparent;
            `;
            card.dataset.index = index;
            card.dataset.symbol = symbol;
            card.addEventListener('click', () => this.flipCard(index));
            board.appendChild(card);
        });
        
        document.getElementById('card-moves').textContent = '0';
        document.getElementById('card-pairs').textContent = '0/8';
        document.getElementById('cardmatch-message').innerHTML = '';
        this.startCardTimer();
    }

    startCardTimer() {
        const timer = document.getElementById('card-timer');
        if (!timer) return;
        
        const updateTimer = () => {
            if (this.currentGame === 'cardmatch' && this.gameData.cardmatch) {
                const elapsed = Math.floor((Date.now() - this.gameData.cardmatch.startTime) / 1000);
                const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
                const seconds = (elapsed % 60).toString().padStart(2, '0');
                timer.textContent = `${minutes}:${seconds}`;
            }
        };
        
        updateTimer();
        this.cardTimerInterval = setInterval(updateTimer, 1000);
    }

    flipCard(index) {
        const game = this.gameData.cardmatch;
        const cards = document.querySelectorAll('.card-cell');
        const card = cards[index];
        
        if (game.flipped.length >= 2 || 
            game.flipped.includes(index) || 
            game.matched.includes(index)) {
            return;
        }
        
        // Flip card
        card.style.background = '#fff';
        card.style.color = '#000';
        card.textContent = game.cards[index];
        game.flipped.push(index);
        
        if (game.flipped.length === 2) {
            game.moves++;
            document.getElementById('card-moves').textContent = game.moves;
            
            const [first, second] = game.flipped;
            
            if (game.cards[first] === game.cards[second]) {
                // Match found
                game.matched.push(first, second);
                game.pairs++;
                document.getElementById('card-pairs').textContent = `${game.pairs}/8`;
                game.flipped = [];
                
                if (game.pairs === 8) {
                    const elapsed = Math.floor((Date.now() - game.startTime) / 1000);
                    document.getElementById('cardmatch-message').innerHTML = 
                        `<div class="alert alert-success">Congratulations! Completed in ${game.moves} moves and ${elapsed} seconds!</div>`;
                    this.saveGameScore('cardmatch', elapsed);
                    clearInterval(this.cardTimerInterval);
                }
            } else {
                // No match, flip back after delay
                setTimeout(() => {
                    cards[first].style.background = '#007bff';
                    cards[first].style.color = 'transparent';
                    cards[first].textContent = '';
                    cards[second].style.background = '#007bff';
                    cards[second].style.color = 'transparent';
                    cards[second].textContent = '';
                    game.flipped = [];
                }, 1000);
            }
        }
    }

    // Save game scores
    async saveGameScore(gameType, score) {
        try {
            const response = await fetch('/api/data/game_score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    game_type: gameType,
                    score: score,
                    time: Date.now()
                })
            });
            
            if (response.ok) {
                console.log(`${gameType} score saved:`, score);
            }
        } catch (error) {
            console.error('Error saving game score:', error);
        }
    }

    // Cleanup method
    cleanup() {
        if (this.sudokuTimerInterval) {
            clearInterval(this.sudokuTimerInterval);
        }
        if (this.cardTimerInterval) {
            clearInterval(this.cardTimerInterval);
        }
    }
}

// Initialize game manager
const gameManager = new GameManager();

// Export for global use
window.gameManager = gameManager;
