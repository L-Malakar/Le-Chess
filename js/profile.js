function handleProfileClick() {
    const data = localStorage.getItem('antrovece_profile');
    if (data) openWin('info-win'); else openWin('profile-win');
}

function saveProfile() {
    const name = document.getElementById('reg-name').value.trim();
    const rank = document.getElementById('reg-class').value;
    if(name.length < 3) return;
    localStorage.setItem('antrovece_profile', JSON.stringify({ name, rank, avatar: selectedAvatar }));
    loadProfile(); 
    closeWin('profile-win');
}

function loadProfile() {
    const data = localStorage.getItem('antrovece_profile');
    if(data) {
        const user = JSON.parse(data);
        document.getElementById('p-name-display').innerText = user.name;
        document.getElementById('p-avatar-display').innerText = user.avatar;
        document.getElementById('game-p-name').innerText = user.name;
        document.getElementById('game-p-avatar').innerText = user.avatar;
        document.getElementById('info-name').innerText = user.name;
        document.getElementById('info-rank').innerText = user.rank;
        document.getElementById('info-avatar').innerText = user.avatar;
    }
}

function changeIdentity() {
    const data = localStorage.getItem('antrovece_profile');
    if (data) {
        const user = JSON.parse(data);
        document.getElementById('reg-name').value = user.name;
        document.getElementById('reg-class').value = user.rank;
        selectedAvatar = user.avatar;
    }
    closeWin('info-win'); 
    openWin('profile-win');
}

function deleteIdentity() {
    if(confirm("Are you sure you want to delete your Identity?")) {
        localStorage.removeItem('antrovece_profile');
        loadProfile(); 
        closeWin('info-win');
    }
}

// Initialize Avatar Grid on load
const avs = ["✋", "👆", "👍", "👊", "✌️", "🙏", "💪", "🧠", "👤", "🎭", "🛡️", "⚔️", "🔱", "🕉️", "👁️"];
document.getElementById('avatar-grid').innerHTML = avs.map(a => 
    `<div onclick="soundEngine.play('click'); selectedAvatar='${a}'; $('.avatar-item').css('background','none'); $(this).css('background','var(--soft-blue)')" class="avatar-item cursor-pointer text-2xl p-2 hover:bg-[var(--soft-blue)] rounded-lg transition-all">${a}</div>`
).join('');

// Load profile on startup
loadProfile();