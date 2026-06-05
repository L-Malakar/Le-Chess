let ytPlayer;
let musicStarted = false;

function onYouTubeIframeAPIReady() {
    const savedTime = parseFloat(localStorage.getItem('antroverce_bgm_time')) || 0;
    ytPlayer = new YT.Player('player', {
        height: '0', width: '0', videoId: 'FFfdyV8gnWk',
        playerVars: { 'autoplay': 0, 'controls': 0, 'start': Math.floor(savedTime), 'loop': 1, 'playlist': 'FFfdyV8gnWk' },
        events: { 'onReady': onPlayerReady }
    });
}

function onPlayerReady(event) {
    setInterval(() => {
        if (ytPlayer && ytPlayer.getCurrentTime) localStorage.setItem('antroverce_bgm_time', ytPlayer.getCurrentTime());
    }, 1000);
}

function handleUserInteraction() {
    toggleFullScreen();
    soundEngine.init(); // From sound.js
    if (!musicStarted && ytPlayer && document.getElementById('set-music').checked) {
        ytPlayer.playVideo();
        musicStarted = true;
    }
}

function toggleMusic() {
    if (!ytPlayer) return;
    if (document.getElementById('set-music').checked) ytPlayer.playVideo();
    else ytPlayer.pauseVideo();
}