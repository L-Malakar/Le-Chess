const pst = {
    p: [[0, 0, 0, 0, 0, 0, 0, 0],[5, 10, 10, -20, -20, 10, 10, 5],[5, -5, -10, 0, 0, -10, -5, 5],[0, 0, 0, 20, 20, 0, 0, 0],[5, 5, 10, 25, 25, 10, 5, 5],[10, 10, 20, 30, 30, 20, 10, 10],[50, 50, 50, 50, 50, 50, 50, 50],[0, 0, 0, 0, 0, 0, 0, 0]],
    n: [[-50, -40, -30, -30, -30, -30, -40, -50],[-40, -20, 0, 5, 5, 0, -20, -40],[-30, 5, 10, 15, 15, 10, 5, -30],[-30, 0, 15, 20, 20, 15, 0, -30],[-30, 5, 10, 15, 15, 10, 5, -30],[-30, 0, 10, 15, 15, 10, 0, -30],[-40, -20, 0, 0, 0, 0, -20, -40],[-50, -40, -30, -30, -30, -30, -40, -50]],
    b: [[-20, -10, -10, -10, -10, -10, -10, -20],[-10, 5, 0, 0, 0, 0, 5, -10],[-10, 10, 10, 10, 10, 10, 10, -10],[-10, 0, 10, 10, 10, 10, 0, -10],[-10, 5, 5, 10, 10, 5, 5, -10],[-10, 0, 5, 10, 10, 5, 0, -10],[-10, 0, 0, 0, 0, 0, 0, -10],[-20, -10, -10, -10, -10, -10, -10, -20]],
    r: [[0, 0, 0, 5, 5, 0, 0, 0],[-5, 0, 0, 0, 0, 0, 0, -5],[-5, 0, 0, 0, 0, 0, 0, -5],[-5, 0, 0, 0, 0, 0, 0, -5],[-5, 0, 0, 0, 0, 0, 0, -5],[-5, 0, 0, 0, 0, 0, 0, -5],[5, 10, 10, 10, 10, 10, 10, 5],[0, 0, 0, 0, 0, 0, 0, 0]],
    q: [[-20, -10, -10, -5, -5, -10, -10, -20],[-10, 0, 5, 0, 0, 0, 0, -10],[-10, 5, 5, 5, 5, 5, 0, -10],[0, 0, 5, 5, 5, 5, 0, -5],[-5, 0, 5, 5, 5, 5, 0, -5],[-10, 0, 5, 5, 5, 5, 0, -10],[-10, 0, 0, 0, 0, 0, 0, -10],[-20, -10, -10, -5, -5, -10, -10, -20]],
    k: [[20, 30, 10, 0, 0, 10, 30, 20],[20, 20, 0, 0, 0, 0, 20, 20],[-10, -20, -20, -20, -20, -20, -20, -10],[-20, -30, -40, -40, -40, -40, -30, -20],[-30, -40, -40, -50, -50, -40, -40, -30],[-30, -40, -40, -50, -50, -40, -40, -30],[-30, -40, -40, -50, -50, -40, -40, -30],[-30, -40, -40, -50, -50, -40, -40, -30]]
};

function evaluateBoard(gameObj) {
    let totalVal = 0; 
    const boardState = gameObj.board();
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = boardState[i][j];
            if (piece) {
                let val = pieceValues[piece.type] * 100; // pieceValues from state.js
                val += pst[piece.type][piece.color === 'w' ? 7-i : i][j];
                totalVal += (piece.color === 'w' ? val : -val);
            }
        }
    }
    return totalVal;
}

function minimax(gameObj, depth, alpha, beta, isMaximizing) {
    if (depth === 0) return -evaluateBoard(gameObj);
    let moves = gameObj.moves();
    
    // Move ordering: prioritize captures
    moves.sort((a, b) => {
        const aCap = a.includes('x') ? 1 : 0;
        const bCap = b.includes('x') ? 1 : 0;
        return bCap - aCap;
    });

    if (isMaximizing) {
        let bestScore = -9999;
        for (const move of moves) {
            gameObj.move(move); 
            bestScore = Math.max(bestScore, minimax(gameObj, depth - 1, alpha, beta, !isMaximizing)); 
            gameObj.undo();
            alpha = Math.max(alpha, bestScore); 
            if (beta <= alpha) return bestScore; // Prune
        }
        return bestScore;
    } else {
        let bestScore = 9999;
        for (const move of moves) {
            gameObj.move(move); 
            bestScore = Math.min(bestScore, minimax(gameObj, depth - 1, alpha, beta, !isMaximizing)); 
            gameObj.undo();
            beta = Math.min(beta, bestScore); 
            if (beta <= alpha) return bestScore; // Prune
        }
        return bestScore;
    }
}

function makeAIMove() {
    if (gameMode !== 'ai' || game.game_over()) return;
    
    document.getElementById('p2-status').classList.remove('hidden');

    // Timeout allows "THINKING..." to render before heavy calculation blocks thread
    setTimeout(() => {
        const moves = game.moves(); 
        if (moves.length === 0) return;
        const diffKey = document.getElementById('sel-diff').value;
        const rand = Math.random(); 
        let move;
        const probs = { baby: 0.2, normal: 0.4, expert: 0.6, master: 0.75, gm: 1.0 };
        const depth = (diffKey === 'gm' || diffKey === 'master') ? 3 : 2;
        
        if (rand < probs[diffKey]) {
            let bestScore = -9999; 
            let bestMove = moves[0];
            for (let i = 0; i < moves.length; i++) {
                game.move(moves[i]); 
                let score = minimax(game, depth - 1, -10000, 10000, false); 
                game.undo();
                if (score > bestScore) { bestScore = score; bestMove = moves[i]; }
            }
            move = bestMove;
        } else {
            move = moves[Math.floor(Math.random() * moves.length)];
        }
        
        const moveRes = game.move(move); 
        updateScore(moveRes); // From game.js
        board.position(game.fen(), false); 
        
        document.getElementById('p2-status').classList.add('hidden');
        updateBoardHighlights(); // From game.js
    }, 50); 
}

function handleHintRequest() {
    if (game.game_over()) return;
    if (gameMode === 'ai' && game.turn() !== playerSide) return;
    const btn = document.getElementById('btn-hint-game');
    btn.disabled = true; btn.innerText = "Thinking...";
    const delay = Math.floor(Math.random() * 2000) + 500;
    setTimeout(() => { showHint(); btn.disabled = false; btn.innerText = "💡 Hint"; }, delay);
}

function showHint() {
    removeHighlights(); // From game.js
    const moves = game.moves({ verbose: true }); 
    if (moves.length === 0) return;
    let bestScore = -9999; 
    let bestMove = moves[0];
    moves.forEach(m => {
        game.move(m); 
        let score = minimax(game, 2, -10000, 10000, false); 
        game.undo();
        if (score > bestScore) { bestScore = score; bestMove = m; }
    });
    highlightSquare(bestMove.from, 'hint-source'); // From game.js
    highlightSquare(bestMove.to, 'hint-target');    // From game.js
}