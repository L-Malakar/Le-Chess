// Removes drag paths, hints, and check alerts, but KEEPS the last move/capture red
function removeTemporaryHighlights() { 
    $('#mainBoard .square-55d63').removeClass('dot-highlight capture-highlight hint-source-highlight hint-target-highlight king-check-highlight'); 
}

// Completely wipes the board (used for Undo and New Game)
function removeHighlights() { 
    $('#mainBoard .square-55d63').removeClass('dot-highlight capture-highlight king-check-highlight hint-source-highlight hint-target-highlight last-move-highlight capture-death-highlight'); 
}

function highlightSquare(square, type) {
    const $square = $('#mainBoard .square-' + square);
    if (type === 'move') $square.addClass('dot-highlight');
    if (type === 'capture') $square.addClass('capture-highlight');
    if (type === 'king-check') $square.addClass('king-check-highlight');
    if (type === 'hint-source') $square.addClass('hint-source-highlight');
    if (type === 'hint-target') $square.addClass('hint-target-highlight');
    if (type === 'last-move') $square.addClass('last-move-highlight');
    if (type === 'capture-death') $square.addClass('capture-death-highlight');
}

function updateBoardHighlights() {
    // Only clear the persistent move layers, keeping any weird edge cases clean
    $('#mainBoard .square-55d63').removeClass('last-move-highlight capture-death-highlight king-check-highlight');
    
    // Draw the path: Yellow for normal, Red for capture
    if (lastMove) {
        highlightSquare(lastMove.from, 'last-move');
        
        if (lastMove.captured) {
            highlightSquare(lastMove.to, 'capture-death'); // Solid red for death
        } else {
            highlightSquare(lastMove.to, 'last-move');   // Yellow for normal move
        }
    }
    
    updateTurnUI();
    checkGameState();
}

function showAlert(type) {
    const id = type === 'check' ? 'check-alert' : 'mate-alert';
    const el = document.getElementById(id);
    el.classList.remove('animate-zoom'); void el.offsetWidth; el.classList.add('animate-zoom');
    const kingPos = findKing(game.turn());
    if(kingPos) highlightSquare(kingPos, 'king-check');
    soundEngine.play(type);
    
    if (type === 'check') fxManager.playCheckWave();
    if (type === 'mate') fxManager.playMateKill();
}

function findKing(color) {
    for(let r=0; r<8; r++) {
        for(let c=0; c<8; c++) {
            let sq = String.fromCharCode(97 + c) + (8 - r);
            let p = game.get(sq);
            if(p && p.type === 'k' && p.color === color) return sq;
        }
    }
    return null;
}

function updateTurnUI() {
    const turn = game.turn();
    const p1Card = document.getElementById('p1-card');
    const p2Card = document.getElementById('p2-card');
    const p1Status = document.getElementById('p1-status');
    const p2Status = document.getElementById('p2-status');
    const mainBoard = document.getElementById('mainBoard');

    p1Status.classList.add('hidden');
    p2Status.classList.add('hidden');

    if (turn === 'w') {
        p1Card.classList.add('active-player'); p2Card.classList.remove('active-player');
        mainBoard.classList.add('white-turn-shadow'); mainBoard.classList.remove('black-turn-shadow');
        if (gameMode === 'pvp') mainBoard.classList.remove('rotate-180');
    } else {
        p2Card.classList.add('active-player'); p1Card.classList.remove('active-player');
        mainBoard.classList.add('black-turn-shadow'); mainBoard.classList.remove('white-turn-shadow');
        if (gameMode === 'pvp') mainBoard.classList.add('rotate-180');
    }
}

function checkGameState() {
    if (game.in_checkmate()) {
        showAlert('mate');
        const winnerColor = game.turn() === 'w' ? 'b' : 'w';
        setTimeout(() => {
            if (gameMode === 'ai') {
                if (winnerColor === playerSide) { soundEngine.play('win'); openWin('win-win'); }
                else { soundEngine.play('mate'); openWin('lose-win'); }
            } else {
                soundEngine.play('win');
                const winnerName = (winnerColor === 'w') ? "White" : "Black";
                document.getElementById('win-msg').innerText = `${winnerName} has conquered the board!`;
                openWin('win-win');
            }
        }, 2500);
    } else if (game.in_draw()) {
        let reason = "The game has ended in a Draw.";
        if (game.in_stalemate()) reason = "Draw by Stalemate: No legal moves.";
        else if (game.in_threefold_repetition()) reason = "Draw by Threefold Repetition.";
        else if (game.insufficient_material()) reason = "Draw by Insufficient Material.";
        else if (game.in_draw()) reason = "Draw by 50-move rule.";
        document.getElementById('draw-reason').innerText = reason;
        openWin('draw-win');
    } else if (game.in_check()) {
        showAlert('check');
    }
}

function updateScore(move) {
    if (move.captured) {
        soundEngine.play('capture');
        const val = pieceValues[move.captured];
        if (move.color === 'w') p1Score += val; else p2Score += val;
        document.getElementById('p1-score').innerText = p1Score;
        document.getElementById('p2-score').innerText = p2Score;
        
        const squareEl = document.querySelector(`.square-${move.to}`);
        if (squareEl) {
            const rect = squareEl.getBoundingClientRect();
            fxManager.createCaptureParticles(rect.left + rect.width/2, rect.top + rect.height/2, move.color === 'w' ? 'b' : 'w');
        }
    } else {
        soundEngine.play('move');
    }
    lastMove = move; 
}

function initGame() {
    document.getElementById('home-menu').classList.add('hidden');
    document.getElementById('setup-win').classList.add('hidden');
    document.getElementById('game-ui').classList.remove('hidden');
    game = new Chess();
    p1Score = 0; p2Score = 0; lastMove = null;
    document.getElementById('p1-score').innerText = "0";
    document.getElementById('p2-score').innerText = "0";
    playerSide = document.getElementById('sel-side').value;
    gameMode = document.getElementById('sel-mode').value;
    showPaths = document.getElementById('cfg-paths').checked;
    
    document.getElementById('btn-hint-game').style.display = document.getElementById('cfg-hints').checked ? 'block' : 'none';
    document.getElementById('btn-undo-game').style.display = document.getElementById('cfg-undo').checked ? 'block' : 'none';

    if (gameMode === 'pvp') {
        document.getElementById('game-opp-name').innerText = "Player 2";
        document.getElementById('game-opp-avatar').innerText = "👤";
    } else {
        document.getElementById('game-opp-name').innerText = "Akasha AI";
        document.getElementById('game-opp-avatar').innerText = "🤖";
    }

    const timeVal = document.getElementById('sel-time').value;
    if(timeVal !== 'unlimited') {
        let total = (timeVal === 'custom') ? (parseInt(document.getElementById('cust-h').value)*3600 + parseInt(document.getElementById('cust-m').value)*60 + parseInt(document.getElementById('cust-s').value)) : parseInt(timeVal);
        p1Seconds = total; p2Seconds = total;
        startTimer();
    } else { 
        p1Seconds = -1; p2Seconds = -1; 
        document.getElementById('p1-timer').innerText = "∞"; 
        document.getElementById('p2-timer').innerText = "∞"; 
    }
    
    const config = {
        draggable: true,
        orientation: playerSide === 'w' ? 'white' : 'black',
        position: 'start',
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
        onDragStart: (source, piece) => {
            if (game.game_over()) return false;
            const turn = game.turn();
            if ((turn === 'w' && piece.search(/^b/) !== -1) || (turn === 'b' && piece.search(/^w/) !== -1)) return false;
            if (gameMode === 'ai' && turn !== playerSide) return false;
            removeTemporaryHighlights(); // Changed so it doesn't wipe the red/yellow history
            if (showPaths) {
                const moves = game.moves({ square: source, verbose: true });
                moves.forEach(m => highlightSquare(m.to, m.captured ? 'capture' : 'move'));
            }
        },
        onDrop: (source, target) => {
            removeTemporaryHighlights(); // Changed so it doesn't wipe the red/yellow history
            const moves = game.moves({ square: source, verbose: true });
            const moveDetails = moves.find(m => m.from === source && m.to === target);
            
            if (!moveDetails) return 'snapback'; 
            
            const colorPrefix = game.turn();
            document.querySelector('.piece-img-swap-q').src = `https://chessboardjs.com/img/chesspieces/wikipedia/${colorPrefix}Q.png`;
            document.querySelector('.piece-img-swap-r').src = `https://chessboardjs.com/img/chesspieces/wikipedia/${colorPrefix}R.png`;
            document.querySelector('.piece-img-swap-b').src = `https://chessboardjs.com/img/chesspieces/wikipedia/${colorPrefix}B.png`;
            document.querySelector('.piece-img-swap-n').src = `https://chessboardjs.com/img/chesspieces/wikipedia/${colorPrefix}N.png`;

            if (moveDetails.promotion) {
                pendingPromotion = { from: source, to: target };
                openWin('promotion-win'); 
                return 'snapback'; 
            }
            
            let moveResult = game.move({ from: source, to: target, promotion: 'q' });
            updateScore(moveResult);
            board.position(game.fen());
            
            if (!game.game_over() && gameMode === 'ai') window.setTimeout(makeAIMove, 400);
            else updateBoardHighlights();
        },
        onSnapEnd: () => {
            board.position(game.fen());
            updateBoardHighlights();
        }
    };
    
    if(board) board.destroy();
    board = Chessboard('mainBoard', config);
    
    $('#mainBoard').on('click', '.square-55d63', function() {
        const square = $(this).data('square'); const piece = game.get(square);
        if (!piece) return;
        removeTemporaryHighlights(); // Changed so it doesn't wipe the red/yellow history
        const turn = game.turn();
        if (showPaths && piece.color === turn) {
            if (gameMode === 'ai' && turn !== playerSide) return;
            const moves = game.moves({ square: square, verbose: true });
            moves.forEach(m => highlightSquare(m.to, m.captured ? 'capture' : 'move'));
        }
    });
    
    updateTurnUI();
    if (gameMode === 'ai' && playerSide === 'b') window.setTimeout(makeAIMove, 500);
}

function resolvePromotion(pieceChar) {
    if (!pendingPromotion) return;
    const move = game.move({ from: pendingPromotion.from, to: pendingPromotion.to, promotion: pieceChar });
    soundEngine.play('click'); 
    updateScore(move); 
    board.position(game.fen());
    closeWin('promotion-win'); 
    pendingPromotion = null;
    
    if (!game.game_over() && gameMode === 'ai') window.setTimeout(makeAIMove, 400);
    else updateBoardHighlights();
}

function startTimer() {
    if(gameTimer) clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        const turn = game.turn();
        if (turn === 'w') {
            if (p1Seconds > 0) p1Seconds--;
            else if (p1Seconds === 0) { timeOut('w'); return; }
        } else {
            if (p2Seconds > 0) p2Seconds--;
            else if (p2Seconds === 0) { timeOut('b'); return; }
        }
        document.getElementById('p1-timer').innerText = formatTime(p1Seconds);
        document.getElementById('p2-timer').innerText = formatTime(p2Seconds);
    }, 1000);
}

function timeOut(color) {
    clearInterval(gameTimer); soundEngine.play('mate');
    if (gameMode === 'ai') { openWin('lose-win'); document.querySelector('#lose-win p').innerText = "Time has run out."; }
    else {
        const winner = color === 'w' ? "Black" : "White";
        document.getElementById('win-msg').innerText = `${winner} wins on time!`;
        openWin('win-win');
    }
}

function undo() { 
    let history = game.history(); if (history.length === 0) return;
    let steps = (gameMode === 'ai') ? 2 : 1;
    if (gameMode === 'ai' && playerSide === 'b' && history.length === 1) steps = 1;
    
    document.getElementById('p2-status').classList.add('hidden');

    for(let i=0; i < steps; i++) {
        if (game.history().length > 0) {
            const move = game.undo();
            if(move && move.captured) {
                const val = pieceValues[move.captured];
                if (move.color === 'w') p1Score -= val; else p2Score -= val;
            }
        }
    }
    
    const newHistory = game.history({verbose: true});
    lastMove = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null;

    document.getElementById('p1-score').innerText = p1Score;
    document.getElementById('p2-score').innerText = p2Score;
    board.position(game.fen()); 
    updateBoardHighlights();
}

function backToMenu() {
    if(gameTimer) clearInterval(gameTimer);
    document.getElementById('game-ui').classList.add('hidden');
    document.getElementById('surrender-confirm-win').classList.add('hidden');
    document.getElementById('home-menu').classList.remove('hidden');
    setPhase('menu'); if(board) board.destroy();
    document.getElementById('mainBoard').classList.remove('rotate-180');
}

function resetToSetup() {
    if(gameTimer) clearInterval(gameTimer);
    document.getElementById('win-win').classList.add('hidden');
    document.getElementById('lose-win').classList.add('hidden');
    document.getElementById('draw-win').classList.add('hidden');
    document.getElementById('game-ui').classList.add('hidden');
    document.getElementById('home-menu').classList.remove('hidden');
    if(board) board.destroy();
    document.getElementById('mainBoard').classList.remove('rotate-180');
    setPhase('setup'); openWin('setup-win');
}