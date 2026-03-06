/* ============================================
   ROAD TO ROCK — Game Engine
   ============================================ */

const SONGS = {
  easy: [
    { file: './easy/LedZeppelin.m4a', answer: 'LED ZEPPELIN' },
    { file: './easy/Kansas.m4a', answer: 'KANSAS' },
    { file: './easy/TheEagles.m4a', answer: 'EAGLES' },
    { file: './easy/RollingStones.m4a', answer: 'ROLLING STONES' },
    { file: './easy/Heart.m4a', answer: 'HEART' },
    { file: './easy/RodStewart.m4a', answer: 'ROD STEWART' },
    { file: './easy/BlackSabbath.m4a', answer: 'BLACK SABBATH' },
    { file: './easy/LynyrdSkynyrd.m4a', answer: 'LYNYRD SKYNYRD' },
    { file: './easy/PinkFloyd.m4a', answer: 'PINK FLOYD' },
    { file: './easy/TheHollies.m4a', answer: 'HOLLIES' },
  ],
  medium: [
    { file: './medium/acdc.m4a', answer: 'ACDC' },
    { file: './medium/BlueOysterCult.m4a', answer: 'BLUE OYSTER CULT' },
    { file: './medium/boston.m4a', answer: 'BOSTON' },
    { file: './medium/creedence.m4a', answer: 'CREEDENCE CLEARWATER REVIVAL' },
    { file: './medium/jimihendrix.m4a', answer: 'JIMI HENDRIX' },
    { file: './medium/scorpions.m4a', answer: 'SCORPIONS' },
    { file: './medium/theanimals.m4a', answer: 'ANIMALS' },
    { file: './medium/thekinks.m4a', answer: 'KINKS' },
    { file: './medium/thewho.m4a', answer: 'WHO' },
    { file: './medium/zztop.m4a', answer: 'ZZ TOP' },
  ],
  hard: [
    { file: './hard/badcompany.m4a', answer: 'BAD COMPANY' },
    { file: './hard/bobdylan.m4a', answer: 'BOB DYLAN' },
    { file: './hard/cream.m4a', answer: 'CREAM' },
    { file: './hard/derekandthedominoes.m4a', answer: 'DEREK AND THE DOMINOES' },
    { file: './hard/fleetwoodmac.m4a', answer: 'FLEETWOOD MAC' },
    { file: './hard/goldenearring.m4a', answer: 'GOLDEN EARRING' },
    { file: './hard/joewalsh.m4a', answer: 'JOE WALSH' },
    { file: './hard/loureed.m4a', answer: 'LOU REED' },
    { file: './hard/steppenwolf.m4a', answer: 'STEPPENWOLF' },
    { file: './hard/theyardbirds.m4a', answer: 'YARDBIRDS' },
  ],
};

const TOTAL_ROUNDS = 10;
const MAX_STRIKES = 3;

// ---- State ----
let state = {
  screen: 'landing',
  playerName: '',
  difficulty: '',
  songs: [],
  round: 0,
  score: 0,
  strikes: 0,
  hasPlayed: false,
  hasSubmitted: false,
  currentAudio: null,
  results: [], // 'correct' | 'wrong' per round
};

// ---- DOM refs ----
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const screens = {
  landing: $('#landing'),
  game: $('#game'),
  result: $('#result'),
};

// ---- Noise background ----
function initNoise() {
  const canvas = $('#noise-canvas');
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function draw() {
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  resize();
  draw();
  window.addEventListener('resize', () => { resize(); draw(); });
  // Subtle refresh
  setInterval(draw, 150);
}

// ---- Waveform bars ----
function initWaveform() {
  const container = $('.wave-bars');
  container.innerHTML = '';
  const count = 40;
  for (let i = 0; i < count; i++) {
    const bar = document.createElement('div');
    bar.className = 'wave-bar';
    const h = 4 + Math.random() * 24;
    bar.style.setProperty('--wave-h', h + 'px');
    bar.style.animationDelay = (Math.random() * 0.8) + 's';
    container.appendChild(bar);
  }
}

// ---- Progress markers ----
function initProgressMarkers() {
  const container = $('#progress-markers');
  container.innerHTML = '';
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    const marker = document.createElement('div');
    marker.className = 'progress-marker';
    marker.dataset.index = i;
    container.appendChild(marker);
  }
}

// ---- Fisher-Yates shuffle ----
function shuffle(array) {
  const a = [...array];
  for (let m = a.length; m > 0;) {
    const i = Math.floor(Math.random() * m--);
    [a[m], a[i]] = [a[i], a[m]];
  }
  return a;
}

// ---- Answer matching ----
function checkAnswer(input, correct) {
  const normalized = input.trim().toUpperCase();
  if (normalized === correct) return true;
  if (normalized === 'THE ' + correct) return true;
  if ('THE ' + normalized === correct) return true;
  // Handle AC/DC variant
  if (correct === 'ACDC' && (normalized === 'AC/DC' || normalized === 'AC DC')) return true;
  // Handle CCR shorthand
  if (correct === 'CREEDENCE CLEARWATER REVIVAL' && (normalized === 'CCR' || normalized === 'CREEDENCE')) return true;
  return false;
}

// ---- Screen transitions ----
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  state.screen = name;
}

// ---- Start game ----
function startGame(difficulty) {
  const name = $('#player-name').value.trim();
  state.playerName = name || 'PLAYER';
  state.difficulty = difficulty;
  state.songs = shuffle(SONGS[difficulty]);
  state.round = 0;
  state.score = 0;
  state.strikes = 0;
  state.results = [];
  state.hasPlayed = false;
  state.hasSubmitted = false;
  state.currentAudio = null;

  // Update UI
  $('.player-display-name').textContent = state.playerName;
  $('#score-points').textContent = '0';
  $('#score-strikes').textContent = '0';
  $$('.pip').forEach(p => p.classList.remove('active'));
  $('#progress-fill').style.width = '0%';
  initProgressMarkers();

  showScreen('game');
  loadRound();
}

// ---- Load round ----
function loadRound() {
  if (state.round >= TOTAL_ROUNDS || state.strikes >= MAX_STRIKES) {
    endGame();
    return;
  }

  state.hasPlayed = false;
  state.hasSubmitted = false;

  // Update round indicator
  $('.round-current').textContent = state.round + 1;

  // Reset play button
  const playBtn = $('#play-btn');
  playBtn.classList.remove('is-playing');
  playBtn.disabled = false;

  // Reset answer input
  const input = $('#answer-input');
  const submitBtn = $('#submit-btn');
  input.value = '';
  input.disabled = true;
  submitBtn.disabled = true;

  // Reset feedback
  const feedback = $('#answer-feedback');
  feedback.className = 'answer-feedback';
  feedback.textContent = '';

  // Reset waveform
  $('.waveform').classList.remove('active');

  // Load audio
  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio = null;
  }
  state.currentAudio = new Audio(state.songs[state.round].file);
  state.currentAudio.addEventListener('ended', () => {
    $('#play-btn').classList.remove('is-playing');
    $('.waveform').classList.remove('active');
  });
}

// ---- Play audio ----
function playAudio() {
  if (state.hasSubmitted || !state.currentAudio) return;

  if (state.hasPlayed) {
    // Already played once — can't replay
    return;
  }

  state.hasPlayed = true;
  state.currentAudio.currentTime = 0;
  state.currentAudio.play();

  $('#play-btn').classList.add('is-playing');
  $('#play-btn').disabled = true;
  $('.waveform').classList.add('active');

  // Enable answer input
  const input = $('#answer-input');
  const submitBtn = $('#submit-btn');
  input.disabled = false;
  submitBtn.disabled = false;
  input.focus();
}

// ---- Submit answer ----
function submitAnswer() {
  if (state.hasSubmitted || !state.hasPlayed) return;
  state.hasSubmitted = true;

  const input = $('#answer-input');
  const userAnswer = input.value;
  const correctAnswer = state.songs[state.round].answer;
  const isCorrect = checkAnswer(userAnswer, correctAnswer);

  // Stop audio
  if (state.currentAudio) {
    state.currentAudio.pause();
  }
  $('#play-btn').classList.remove('is-playing');
  $('.waveform').classList.remove('active');

  // Update state
  if (isCorrect) {
    state.score++;
    state.results.push('correct');
  } else {
    state.strikes++;
    state.results.push('wrong');
  }

  // Animate score
  const scoreEl = isCorrect ? $('#score-points') : $('#score-strikes');
  scoreEl.textContent = isCorrect ? state.score : state.strikes;
  scoreEl.classList.add('bump');
  setTimeout(() => scoreEl.classList.remove('bump'), 300);

  // Update strike pips
  if (!isCorrect) {
    const pip = $(`.pip[data-index="${state.strikes - 1}"]`);
    if (pip) pip.classList.add('active');
  }

  // Show feedback
  const feedback = $('#answer-feedback');
  feedback.className = 'answer-feedback show ' + (isCorrect ? 'correct' : 'wrong');
  if (isCorrect) {
    feedback.textContent = 'Correct!';
  } else {
    const displayName = correctAnswer.charAt(0) + correctAnswer.slice(1).toLowerCase();
    feedback.textContent = `It was ${displayName}`;
  }

  // Update progress
  const progressPct = ((state.round + 1) / TOTAL_ROUNDS) * 100;
  $('#progress-fill').style.width = progressPct + '%';

  // Update progress markers
  const marker = $(`.progress-marker[data-index="${state.round}"]`);
  if (marker) {
    marker.classList.add('answered');
    marker.classList.add(isCorrect ? 'correct-marker' : 'wrong-marker');
  }

  // Disable input
  input.disabled = true;
  $('#submit-btn').disabled = true;
  $('#play-btn').disabled = true;

  // Next round after delay
  state.round++;
  setTimeout(loadRound, 1600);
}

// ---- End game ----
function endGame() {
  const won = state.strikes < MAX_STRIKES;

  $('#result-icon').textContent = won ? '\u26A1' : '\uD83D\uDCA5';
  const titleEl = $('#result-title');
  titleEl.textContent = won ? 'ROCK STAR' : 'GAME OVER';
  titleEl.className = 'result-title ' + (won ? 'win' : 'lose');

  $('#result-score').textContent = state.score;

  const messages = won
    ? [
        'You know your classics.',
        'The gods of rock salute you.',
        'Legendary performance.',
      ]
    : [
        'Better luck next time.',
        'The road to rock is long.',
        'Keep listening, keep learning.',
      ];
  $('#result-message').textContent = messages[Math.floor(Math.random() * messages.length)];

  // Reset animations by re-rendering
  const content = $('.result-content');
  content.style.display = 'none';
  void content.offsetHeight;
  content.style.display = '';

  showScreen('result');
}

// ---- Event listeners ----
document.addEventListener('DOMContentLoaded', () => {
  initNoise();
  initWaveform();

  // Difficulty buttons
  $$('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      startGame(btn.dataset.difficulty);
    });
  });

  // Play button
  $('#play-btn').addEventListener('click', playAudio);

  // Answer form
  $('#answer-form').addEventListener('submit', (e) => {
    e.preventDefault();
    submitAnswer();
  });

  // Play again
  $('#play-again-btn').addEventListener('click', () => {
    showScreen('landing');
  });

  // Enter key on name input — focus first difficulty button
  $('#player-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      $('.diff-btn').focus();
    }
  });
});
