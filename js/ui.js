function toggleFullScreen() { 
    if (!document.fullscreenElement) { 
        document.documentElement.requestFullscreen().catch(err => {}); 
    } 
}

function setPhase(phase) { 
    document.body.className = 'phase-' + phase; 
}

function openWin(id) { 
    document.getElementById(id).classList.remove('hidden'); 
    if(id==='how-to-win') updateBook(); // Relies on book.js
}

function closeWin(id) { 
    document.getElementById(id).classList.add('hidden'); 
}

function formatTime(s) {
    if (s === -1) return "∞";
    const h = Math.floor(s / 3600); 
    const m = Math.floor((s % 3600) / 60); 
    const sec = s % 60;
    return (h > 0 ? h + ":" : "") + m.toString().padStart(2, '0') + ":" + sec.toString().padStart(2, '0');
}

function handleTimeChange(val) { 
    if(val === 'custom') openWin('custom-time-win'); 
}

function toggleModeSelect(val) {
    const aiRow = document.getElementById('ai-core-row');
    if (val === 'pvp') aiRow.classList.add('hidden'); 
    else aiRow.classList.remove('hidden');
}

// Flashlight mouse follower
window.addEventListener('mousemove', e => {
    const mask = document.getElementById('flashlight-mask');
    mask.style.setProperty('--mouse-x', e.clientX + 'px');
    mask.style.setProperty('--mouse-y', e.clientY + 'px');
});