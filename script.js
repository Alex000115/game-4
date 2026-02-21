let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
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
    if (board[index] === '' && gameActive && currentPlayer === 'X') {
        board[index] = currentPlayer;
        updateUI();
        if (!checkGameStatus()) {
            currentPlayer = 'O';
            document.getElementById('status').innerText = "AI is thinking...";
            setTimeout(aiMove, 600);
        }
    }
}

function aiMove() {
    if (!gameActive) return;

    let move;
    // Easy Mode Logic: 50% chance of making a random mistake
    if (difficulty === 'easy' && Math.random() < 0.5) {
        let available = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
        move = available[Math.floor(Math.random() * available.length)];
    } else {
        move = getBestMove();
    }

    board[move] = aiPlayer;
    updateUI();
    
    if (!checkGameStatus()) {
        currentPlayer = 'X';
        document.getElementById('status').innerText = "Your Turn (X)";
    }
}

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

function minimax(b, depth, isMax) {
    let res = checkWinnerSilent(b);
    if (res === aiPlayer) return 10;
    if (res === 'X') return -10;
    if (res === 'tie') return 0;

    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (b[i] === '') {
                b[i] = aiPlayer;
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

function checkGameStatus() {
    let result = checkWinnerSilent(board);
    if (result) {
        gameActive = false;
        if (result === 'tie') document.getElementById('status').innerText = "It's a Tie!";
        else document.getElementById('status').innerText = result === 'X' ? "You Win!" : "AI Wins!";
        return true;
    }
    return false;
}

function checkWinnerSilent(b) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let p of wins) {
        if (b[p[0]] && b[p[0]] === b[p[1]] && b[p[0]] === b[p[2]]) return b[p[0]];
    }
    return b.includes('') ? null : 'tie';
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
    gameActive = true;
    document.getElementById('status').innerText = "Your Turn (X)";
    updateUI();
}

function backToMenu() {
    document.getElementById('setup-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
}
