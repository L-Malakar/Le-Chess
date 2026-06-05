// Core Game Instances
let board = null;
let game = new Chess();

// UI & Profile State
let selectedAvatar = '✋';

// Game Settings & State
let gameTimer = null;
let p1Seconds = 0, p2Seconds = 0;
let p1Score = 0, p2Score = 0;
let playerSide = 'w';
let showPaths = true;
let pendingPromotion = null;
let gameMode = 'ai'; 
let lastMove = null;

// Chess piece values used across modules
const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };