let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = false;
let gameMode = 'hard'; 

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]
];

function startGame(mode) {
    gameMode = mode;
    gameActive = true;
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    resetBoard();
}

function makeMove(index) {
    if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        updateUI();
        
        if (checkWin(currentPlayer)) {
            endGame(currentPlayer);
            return;
        }
        if (board.every(cell => cell !== '')) {
            endGame('tie');
            return;
        }

        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
        document.getElementById('status').innerText = `Player ${currentPlayer}'s Turn`;

        if (gameMode !== 'pvp' && currentPlayer === 'O') {
            gameActive = false; // Pause user input during AI turn
            setTimeout(aiMove, 600);
        }
    }
}

function aiMove() {
    let move;
    if (gameMode === 'easy' && Math.random() < 0.5) {
        let available = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
        move = available[Math.floor(Math.random() * available.length)];
    } else {
        move = getBestMove();
    }

    board[move] = 'O';
    updateUI();
    gameActive = true;

    if (checkWin('O')) {
        endGame('O');
    } else if (board.every(cell => cell !== '')) {
        endGame('tie');
    } else {
        currentPlayer = 'X';
        document.getElementById('status').innerText = "Your Turn (X)";
    }
}

function checkWin(player) {
    return winPatterns.some(pattern => {
        if (pattern.every(index => board[index] === player)) {
            if (gameActive || gameMode !== 'pvp') highlightWinner(pattern);
            return true;
        }
        return false;
    });
}

function highlightWinner(pattern) {
    const cells = document.querySelectorAll('.cell');
    pattern.forEach(index => cells[index].classList.add('winner'));
}

function endGame(result) {
    gameActive = false;
    if (result === 'tie') document.getElementById('status').innerText = "It's a Tie!";
    else document.getElementById('status').innerText = `Player ${result} Wins!`;
}

// --- Minimax Algorithm ---
function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) { bestScore = score; move = i; }
        }
    }
    return move;
}

function minimax(b, depth, isMax) {
    if (checkWinSilent(b, 'O')) return 10;
    if (checkWinSilent(b, 'X')) return -10;
    if (b.every(c => c !== '')) return 0;

    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (b[i] === '') {
                b[i] = 'O';
                best = Math.max(best, minimax(b, depth + 1, false));
                b[i] = '';
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (b[i] === '') {
                b[i] = 'X';
                best = Math.min(best, minimax(b, depth + 1, true));
                b[i] = '';
            }
        }
        return best;
    }
}

function checkWinSilent(b, p) {
    return winPatterns.some(pat => pat.every(i => b[i] === p));
}

function updateUI() {
    const cells = document.querySelectorAll('.cell');
    board.forEach((val, i) => {
        cells[i].innerText = val;
        cells[i].style.color = val === 'X' ? '#a29bfe' : '#ff7675';
    });
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    document.querySelectorAll('.cell').forEach(c => {
        c.innerText = '';
        c.classList.remove('winner');
    });
    document.getElementById('status').innerText = "Player X's Turn";
}

function backToMenu() {
    document.getElementById('setup-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
}
