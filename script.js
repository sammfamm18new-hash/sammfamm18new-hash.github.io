// Initialize prayers
const prayers = {
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
    FajrSunnah: false,
    BeforeDhuhr: false,
    AfterDhuhr: false,
    MaghribSunnah: false,
    IshaSunnah: false,
    Dhuha: false,
    Tahajud: false,
    Witr: false
};

const totalPrayers = Object.keys(prayers).length;

// Load saved data
let savedPrayers = JSON.parse(localStorage.getItem('prayerStatus')) || prayers;
let streak = parseInt(localStorage.getItem('streak')) || 0;
let weeklyData = JSON.parse(localStorage.getItem('weeklyData')) || Array(7).fill(0);

// Update buttons from storage
document.querySelectorAll('#prayer-log button').forEach(btn => {
    const key = btn.dataset.prayer;
    if (savedPrayers[key]) btn.classList.add('done');

    btn.addEventListener('click', () => {
        savedPrayers[key] = !savedPrayers[key];
        btn.classList.toggle('done');
        localStorage.setItem('prayerStatus', JSON.stringify(savedPrayers));
        updateStats();
    });
});

// Update stats
function updateStats() {
    const doneCount = Object.values(savedPrayers).filter(v => v).length;
    document.getElementById('todayCount').textContent = doneCount;
    document.getElementById('totalCount').textContent = totalPrayers;

    if (doneCount === totalPrayers && !localStorage.getItem('todayCompleted')) {
        streak++;
        localStorage.setItem('streak', streak);
        localStorage.setItem('todayCompleted', 'true');
    }
    document.getElementById('streak').textContent = streak;

    updateWeeklyChart(doneCount);
}

// Reset daily prayers at midnight
function checkDate() {
    const lastDate = localStorage.getItem('lastDate');
    const today = new Date().toDateString();

    if (lastDate !== today) {
        savedPrayers = {};
        Object.keys(prayers).forEach(p => savedPrayers[p] = false);
        localStorage.setItem('prayerStatus', JSON.stringify(savedPrayers));
        localStorage.setItem('todayCompleted', '');
        localStorage.setItem('lastDate', today);

        // update weekly data (shift array)
        weeklyData.shift();
        weeklyData.push(0);
        localStorage.setItem('weeklyData', JSON.stringify(weeklyData));

        document.querySelectorAll('#prayer-log button').forEach(btn => btn.classList.remove('done'));
        updateStats();
    }
}

checkDate();
updateStats();

// Weekly Chart
const ctx = document.getElementById('weeklyChart').getContext('2d');
let weeklyChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
        datasets: [{
            label: 'Prayers Completed',
            data: weeklyData,
            backgroundColor: '#1a73e8'
        }]
    },
    options: {
        scales: {
            y: { beginAtZero: true, max: totalPrayers }
        }
    }
});

function updateWeeklyChart(todayCount) {
    weeklyData[weeklyData.length - 1] = todayCount;
    weeklyChart.data.datasets[0].data = weeklyData;
    weeklyChart.update();
    localStorage.setItem('weeklyData', JSON.stringify(weeklyData));
}
