const canvas = document.getElementById('bgCanvas'); 
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight;

const pieceTypes = ['wP', 'wN', 'wB', 'wR', 'wQ', 'wK', 'bP', 'bN', 'bB', 'bR', 'bQ', 'bK'];
let bgPieces = []; 
const pieceImages = {}; 
let imagesLoaded = 0;

pieceTypes.forEach(type => {
    const img = new Image(); 
    img.src = `https://chessboardjs.com/img/chesspieces/wikipedia/${type}.png`;
    img.onload = () => { 
        imagesLoaded++; 
        pieceImages[type] = img; 
        if (imagesLoaded === pieceTypes.length) { 
            initBG(); 
            drawBG(); 
        } 
    };
});

function initBG() { 
    for(let i=0; i<15; i++) {
        bgPieces.push({ 
            x: Math.random()*canvas.width, 
            y: Math.random()*canvas.height, 
            speed: Math.random()*0.3+0.1, 
            type: pieceTypes[Math.floor(Math.random()*pieceTypes.length)], 
            size: Math.random()*40+40, 
            opacity: 0.35, 
            floatOffset: Math.random() * 100 
        }); 
    } 
}

function drawBG() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bgPieces.forEach(p => {
        ctx.shadowBlur = 10; 
        ctx.shadowColor = 'rgba(255, 255, 255, 0.1)'; 
        ctx.globalAlpha = p.opacity;
        let xPos = p.x + Math.sin((Date.now() / 2000) + p.floatOffset) * 20;
        if(pieceImages[p.type]) ctx.drawImage(pieceImages[p.type], xPos, p.y, p.size, p.size);
        p.y -= p.speed; 
        if(p.y < -p.size) { 
            p.y = canvas.height + p.size; 
            p.x = Math.random()*canvas.width; 
        }
    });
    requestAnimationFrame(drawBG);
}