// ============================================
//  FITTRACK PRO — app.js
// ============================================

const stepGoal = 10000;
const calGoal  = 500;

// ── 1. LOAD USER DATA FROM LOCALSTORAGE ──────
const user     = JSON.parse(localStorage.getItem('userData')) || {};
const username = user.name     || 'Guest';
const steps    = user.steps    || 0;
const calories = user.calories || 0;
const duration = user.duration || 0;
const weight   = user.weight   || 0;
const height   = user.height   || 1;

// ── 2. GREETING ───────────────────────────────
document.getElementById('greetName').textContent = username;

// ── 3. HERO STAT CARDS ────────────────────────
document.getElementById('stepsVal').textContent = steps.toLocaleString();
document.getElementById('calVal').textContent   = calories.toLocaleString();
document.getElementById('durVal').textContent   = duration;

document.getElementById('stepsRemain').textContent =
  Math.max(stepGoal - steps, 0).toLocaleString() + ' steps remaining';

document.getElementById('calRemain').textContent =
  Math.max(calGoal - calories, 0).toLocaleString() + ' cal remaining';

// ── 4. BMI CALCULATOR ─────────────────────────
// Formula: weight (kg) ÷ height (m)²
const bmi = +(weight / (height * height)).toFixed(1);
document.getElementById('bmiVal').textContent = bmi || '—';

function getBmiInfo(b) {
  if (b < 18.5) return { label: 'Underweight', color: '#38bdf8', pct: 12 };
  if (b < 25)   return { label: 'Normal ✅',   color: '#39ff14', pct: 38 };
  if (b < 30)   return { label: 'Overweight',  color: '#fb923c', pct: 65 };
  return            { label: 'Obese',          color: '#ef4444', pct: 88 };
}

const bmiInfo = getBmiInfo(bmi);
document.getElementById('bmiStatus').textContent = bmiInfo.label;
document.getElementById('bmiStatusBadge').textContent = 'Status: ' + bmiInfo.label;
document.getElementById('bmiStatusBadge').style.background = bmiInfo.color + '20';
document.getElementById('bmiStatusBadge').style.color      = bmiInfo.color;
document.getElementById('bmiStatusBadge').style.border     = '1px solid ' + bmiInfo.color + '40';

// Animate BMI bar after short delay
setTimeout(() => {
  document.getElementById('bmiBar').style.width      = bmiInfo.pct + '%';
  document.getElementById('bmiBar').style.background =
    `linear-gradient(90deg, ${bmiInfo.color}, ${bmiInfo.color}aa)`;
}, 300);

// ── 5. MOTIVATIONAL COMMENT ───────────────────
function getComment(pct) {
  if (pct >= 100) return 'Amazing! 🚀';
  if (pct >= 70)  return 'Awesome! 🔥';
  if (pct >= 30)  return 'Keep going! 💪';
  return 'Start moving! ⚡';
}

// ── 6. PROGRESS RINGS ─────────────────────────
const stepPct = Math.min((steps / stepGoal) * 100, 100);
const calPct  = Math.min((calories / calGoal) * 100, 100);

document.getElementById('stepsPct').textContent    = Math.round(stepPct) + '%';
document.getElementById('calPct').textContent      = Math.round(calPct) + '%';
document.getElementById('stepsRemain2').textContent = steps.toLocaleString() + ' / ' + stepGoal.toLocaleString();
document.getElementById('calRemain2').textContent   = calories + ' / ' + calGoal;
document.getElementById('stepsComment').textContent = getComment(stepPct);
document.getElementById('calComment').textContent   = getComment(calPct);

// SVG ring circumference = 2 × π × radius = 2 × π × 52 = 326.7
const circumference = 2 * Math.PI * 52;

// Animate rings after short delay
setTimeout(() => {
  document.getElementById('stepsCircle').style.strokeDashoffset =
    circumference - (stepPct / 100) * circumference;
  document.getElementById('calCircle').style.strokeDashoffset =
    circumference - (calPct / 100) * circumference;
}, 300);

// ── 7. SAVE HISTORY (last 7 days) ─────────────
const histKey = 'history_' + username;
let history   = JSON.parse(localStorage.getItem(histKey)) || [];

history.push({ steps, calories });          // Add today
if (history.length > 7) history.shift();   // Remove oldest if more than 7
localStorage.setItem(histKey, JSON.stringify(history)); // Save back

// ── 8. STREAK COUNTER ─────────────────────────
document.getElementById('streakNum').textContent = history.length;

// ── 9. CHARTS (Chart.js) ──────────────────────
const labels    = history.map((_, i) => 'Day ' + (i + 1));
const stepsData = history.map(d => d.steps);
const calData   = history.map(d => d.calories);

// Shared chart options
const chartDefaults = {
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid:  { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 } }
    },
    y: {
      grid:  { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 } }
    }
  },
  animation: { duration: 1500, easing: 'easeInOutQuart' }
};

// Steps line chart
new Chart(document.getElementById('stepsChart'), {
  type: 'line',
  data: {
    labels,
    datasets: [{
      data: stepsData,
      borderColor: '#39ff14',
      backgroundColor: 'rgba(57,255,20,0.06)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#39ff14',
      pointRadius: 4,
      pointHoverRadius: 7
    }]
  },
  options: chartDefaults
});

// Calories line chart
new Chart(document.getElementById('calChart'), {
  type: 'line',
  data: {
    labels,
    datasets: [{
      data: calData,
      borderColor: '#ff3c6f',
      backgroundColor: 'rgba(255,60,111,0.06)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#ff3c6f',
      pointRadius: 4,
      pointHoverRadius: 7
    }]
  },
  options: chartDefaults
});
