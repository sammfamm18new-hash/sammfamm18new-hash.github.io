// Initialize or load local storage
let prayerStatus = JSON.parse(localStorage.getItem('prayerStatus')) || {
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false
};

let streak = parseInt(localStorage.getItem('streak')) || 0;

// Update buttons based on saved status
document.querySelectorAll('#prayer-log button').forEach(btn => {
    const prayer = btn.dataset.prayer;
    if (prayerStatus[prayer]) btn.classList.add('done');

    btn.addEventListener('click', () => {
        btn.classList.toggle('done');
        prayerStatus[prayer] = !prayerStatus[prayer];
        localStorage.setItem('prayerStatus', JSON.stringify(prayerStatus));
        updateStats();
    });
});

// Update stats function
function updateStats() {
    const doneCount = Object.values(prayerStatus).filter(v => v).length;
    document.getElementById('todayCount').textContent = doneCount;

    if (doneCount === 5 && !localStorage.getItem('todayCompleted')) {
        streak++;
        localStorage.setItem('streak', streak);
        localStorage.setItem('todayCompleted', 'true');
    }

    document.getElementById('streak').textContent = streak;
}

// Reset daily prayers at midnight
function checkDate() {
    const lastDate = localStorage.getItem('lastDate');
    const today = new Date().toDateString();

    if (lastDate !== today) {
        // Reset for new day
        prayerStatus = {
            Fajr: false,
            Dhuhr: false,
            Asr: false,
            Maghrib: false,
            Isha: false
        };
        localStorage.setItem('prayerStatus', JSON.stringify(prayerStatus));
        localStorage.setItem('todayCompleted', '');
        localStorage.setItem('lastDate', today);
        document.querySelectorAll('#prayer-log button').forEach(btn => btn.classList.remove('done'));
        updateStats();
    }
}

checkDate();
updateStats();

