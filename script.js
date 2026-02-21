let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // User is X
let aiPlayer = 'O';
let gameActive = false;
let difficulty = 'hard';

function startGame(mode) {
    difficulty = mode;
    gameActive = true;
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    resetBoard();
}

function makeMove(index) {
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        updateBoard();
        if (!checkWinner(board)) {
            setTimeout(aiMove, 500); // AI moves after 0.5s
        }
    }
}

function aiMove() {
    let move;
    
    // Easy mode: AI makes a random mistake 50% of the time
    if (difficulty === 'easy' && Math.random() < 0.5) {
        let availableMoves = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else {
        // Hard mode or Smart move in Easy: Use Minimax
        move = getBestMove();
    }

    if (move !== undefined) {
        board[move] = aiPlayer;
        updateBoard();
        checkWinner(board);
    }
}

// Minimax Algorithm Logic
function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = aiPlayer;
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(tempBoard, depth, isMaximizing) {
    let result = checkWinnerSilent(tempBoard);
    if (result === aiPlayer) return 10;
    if (result === currentPlayer) return -10;
    if (result === 'tie') return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (tempBoard[i] === '') {
                tempBoard[i] = aiPlayer;
                let score = minimax(tempBoard, depth + 1, false);
                tempBoard[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (tempBoard[i] === '') {
                tempBoard[i] = currentPlayer;
                let score = minimax(tempBoard, depth + 1, true);
                tempBoard[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Helper functions for UI and Winning logic
function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    board.forEach((val, i) => cells[i].innerText = val);
}

function checkWinner(b) {
    let winner = checkWinnerSilent(b);
    if (winner) {
        gameActive = false;
        document.getElementById('status').innerText = winner === 'tie' ? "It's a Tie!" : `${winner} Wins!`;
        return true;
    }
    return false;
}

function checkWinnerSilent(b) {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]
    ];
    for (let p of winPatterns) {
        if (b[p[0]] && b[p[0]] === b[p[1]] && b[p[0]] === b[p[2]]) return b[p[0]];
    }
    if (!b.includes('')) return 'tie';
    return null;
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    document.getElementById('status').innerText = "Your Turn";
    updateBoard();
}

function resetGame() {
    document.getElementById('setup-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
}
