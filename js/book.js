const bookData = [
    { img: "https://chessboardjs.com/img/chesspieces/wikipedia/wP.png", text: "<b>Padati (Pawn):</b> Moves one square forward, but captures diagonally. On its first move, it can leap two squares." },
    { img: "https://chessboardjs.com/img/chesspieces/wikipedia/wN.png", text: "<b>Ashva (Knight):</b> Moves in an 'L' shape. It is the only unit that can leap over other pieces." },
    { img: "https://chessboardjs.com/img/chesspieces/wikipedia/wB.png", text: "<b>Gaja (Bishop):</b> Moves diagonally any distance." },
    { img: "https://chessboardjs.com/img/chesspieces/wikipedia/wR.png", text: "<b>Ratha (Rook):</b> Moves horizontally or vertically any distance." },
    { img: "https://chessboardjs.com/img/chesspieces/wikipedia/wQ.png", text: "<b>Mantri (Queen):</b> The most powerful force. Combines Ratha and Gaja." },
    { img: "https://chessboardjs.com/img/chesspieces/wikipedia/wK.png", text: "<b>Raja (King):</b> Your divine essence. Loss of Raja means defeat." }
];
let currentPage = 0;

function changePage(dir) { 
    currentPage += dir; 
    updateBook(); 
}

function updateBook() {
    const page = bookData[currentPage];
    document.getElementById('book-img').innerHTML = `<img src="${page.img}" class="w-16 h-16">`;
    document.getElementById('book-content').innerHTML = page.text;
    document.getElementById('page-num').innerText = `${currentPage + 1}/${bookData.length}`;
    document.getElementById('prev-page').style.visibility = currentPage === 0 ? 'hidden' : 'visible';
    document.getElementById('next-page').style.visibility = currentPage === bookData.length - 1 ? 'hidden' : 'visible';
}