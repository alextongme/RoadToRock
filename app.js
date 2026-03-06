/* ============================================
   ROAD TO ROCK — Game Engine
   ============================================ */

const SONGS = {
  easy: [
    { file: './easy/LedZeppelin.m4a', answers: ['LED ZEPPELIN', 'ZEPPELIN', 'LED ZEP'] },
    { file: './easy/Kansas.m4a', answers: ['KANSAS'] },
    { file: './easy/TheEagles.m4a', answers: ['EAGLES', 'THE EAGLES'] },
    { file: './easy/RollingStones.m4a', answers: ['ROLLING STONES', 'THE ROLLING STONES', 'STONES'] },
    { file: './easy/Heart.m4a', answers: ['HEART'] },
    { file: './easy/RodStewart.m4a', answers: ['ROD STEWART', 'ROD STEWERT'] },
    { file: './easy/BlackSabbath.m4a', answers: ['BLACK SABBATH', 'BLACK SABATH'] },
    { file: './easy/LynyrdSkynyrd.m4a', answers: ['LYNYRD SKYNYRD', 'LYNARD SKYNARD', 'LYNARD SKYNYRD', 'LYNYRD SKYNARD', 'LYNRD SKYNRD'] },
    { file: './easy/PinkFloyd.m4a', answers: ['PINK FLOYD', 'PINK FLOID'] },
    { file: './easy/TheHollies.m4a', answers: ['HOLLIES', 'THE HOLLIES'] },
  ],
  medium: [
    { file: './medium/acdc.m4a', answers: ['AC/DC', 'ACDC', 'AC DC', 'AC-DC'] },
    { file: './medium/BlueOysterCult.m4a', answers: ['BLUE OYSTER CULT', 'BLUE OISTER CULT', 'BLUE OYSTER CULT'] },
    { file: './medium/boston.m4a', answers: ['BOSTON'] },
    { file: './medium/creedence.m4a', answers: ['CREEDENCE CLEARWATER REVIVAL', 'CCR', 'CREEDENCE', 'CREDENCE CLEARWATER REVIVAL', 'CREDENCE'] },
    { file: './medium/jimihendrix.m4a', answers: ['JIMI HENDRIX', 'JIMMY HENDRIX', 'JIMI HENDRICKS', 'JIMMY HENDRICKS', 'HENDRIX'] },
    { file: './medium/scorpions.m4a', answers: ['SCORPIONS', 'THE SCORPIONS'] },
    { file: './medium/theanimals.m4a', answers: ['ANIMALS', 'THE ANIMALS'] },
    { file: './medium/thekinks.m4a', answers: ['KINKS', 'THE KINKS'] },
    { file: './medium/thewho.m4a', answers: ['WHO', 'THE WHO'] },
    { file: './medium/zztop.m4a', answers: ['ZZ TOP', 'ZZTOP', 'Z Z TOP'] },
  ],
  hard: [
    { file: './hard/badcompany.m4a', answers: ['BAD COMPANY', 'BAD CO'] },
    { file: './hard/bobdylan.m4a', answers: ['BOB DYLAN', 'DYLAN', 'BOB DILLON'] },
    { file: './hard/cream.m4a', answers: ['CREAM'] },
    { file: './hard/derekandthedominoes.m4a', answers: ['DEREK AND THE DOMINOES', 'DEREK & THE DOMINOES', 'DEREK AND THE DOMINOS', 'DEREK & THE DOMINOS'] },
    { file: './hard/fleetwoodmac.m4a', answers: ['FLEETWOOD MAC', 'FLEETWOOD MACK', 'FLEETWOOD'] },
    { file: './hard/goldenearring.m4a', answers: ['GOLDEN EARRING', 'GOLDEN EARING', 'GOLDEN EAR RING'] },
    { file: './hard/joewalsh.m4a', answers: ['JOE WALSH', 'JOE WALSCH'] },
    { file: './hard/loureed.m4a', answers: ['LOU REED', 'LOU READ'] },
    { file: './hard/steppenwolf.m4a', answers: ['STEPPENWOLF', 'STEPPEN WOLF', 'STEPPINWOLF'] },
    { file: './hard/theyardbirds.m4a', answers: ['YARDBIRDS', 'THE YARDBIRDS', 'YARD BIRDS', 'THE YARD BIRDS'] },
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
  isPlaying: false,
  currentAudio: null,
  results: [],
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
function normalizeAnswer(str) {
  return str.trim().toUpperCase().replace(/\s+/g, ' ');
}

function checkAnswer(input, acceptedAnswers) {
  const normalized = normalizeAnswer(input);
  if (!normalized) return false;
  for (const answer of acceptedAnswers) {
    if (normalized === answer) return true;
    // Try with/without "THE " prefix
    if (normalized === 'THE ' + answer) return true;
    if ('THE ' + normalized === answer) return true;
  }
  return false;
}

function getDisplayName(answers) {
  // Return the first (canonical) answer in title case
  const name = answers[0];
  return name.split(' ').map(w =>
    w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  ).join(' ');
}

// ---- Screen transitions ----
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  state.screen = name;

  // Show/hide video background
  const vid = $('#bgvid');
  if (vid) {
    if (name === 'landing') {
      vid.classList.remove('hidden');
    } else {
      vid.classList.add('hidden');
    }
  }
}

// ---- Name validation ----
function validateName() {
  const name = $('#player-name').value.trim();
  const buttons = $$('.diff-btn');
  const hint = $('#name-hint');
  if (name.length > 0) {
    buttons.forEach(b => b.disabled = false);
    hint.classList.remove('show');
  } else {
    buttons.forEach(b => b.disabled = true);
    hint.classList.remove('show');
  }
}

function showNameHint() {
  const hint = $('#name-hint');
  hint.classList.add('show');
  setTimeout(() => hint.classList.remove('show'), 2000);
}

// ---- Start game ----
function startGame(difficulty) {
  const name = $('#player-name').value.trim();
  if (!name) {
    showNameHint();
    $('#player-name').focus();
    return;
  }

  state.playerName = name;
  state.difficulty = difficulty;
  state.songs = shuffle(SONGS[difficulty]);
  state.round = 0;
  state.score = 0;
  state.strikes = 0;
  state.results = [];
  state.hasPlayed = false;
  state.hasSubmitted = false;
  state.isPlaying = false;
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
  state.isPlaying = false;

  // Update round indicator
  $('.round-current').textContent = state.round + 1;

  // Reset play button
  const playBtn = $('#play-btn');
  playBtn.classList.remove('is-playing');
  playBtn.disabled = false;
  $('.play-text').textContent = 'LISTEN';

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
    state.isPlaying = false;
    $('#play-btn').classList.remove('is-playing');
    $('.waveform').classList.remove('active');
    $('.play-text').textContent = 'REPLAY';
  });
}

// ---- Play/Pause/Replay audio ----
function toggleAudio() {
  if (state.hasSubmitted || !state.currentAudio) return;

  const playBtn = $('#play-btn');

  if (state.isPlaying) {
    // Pause
    state.currentAudio.pause();
    state.isPlaying = false;
    playBtn.classList.remove('is-playing');
    $('.waveform').classList.remove('active');
    $('.play-text').textContent = 'PLAY';
  } else {
    // Play or resume
    state.currentAudio.play();
    state.isPlaying = true;
    state.hasPlayed = true;
    playBtn.classList.add('is-playing');
    $('.waveform').classList.add('active');
    $('.play-text').textContent = 'LISTEN';

    // Enable answer input on first play
    const input = $('#answer-input');
    const submitBtn = $('#submit-btn');
    input.disabled = false;
    submitBtn.disabled = false;
    input.focus();
  }
}

// ---- Submit answer ----
function submitAnswer() {
  if (state.hasSubmitted || !state.hasPlayed) return;

  const input = $('#answer-input');
  if (!input.value.trim()) return;

  state.hasSubmitted = true;

  const userAnswer = input.value;
  const acceptedAnswers = state.songs[state.round].answers;
  const isCorrect = checkAnswer(userAnswer, acceptedAnswers);

  // Stop audio
  if (state.currentAudio) {
    state.currentAudio.pause();
  }
  state.isPlaying = false;
  $('#play-btn').classList.remove('is-playing');
  $('#play-btn').disabled = true;
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
    feedback.textContent = `It was ${getDisplayName(acceptedAnswers)}`;
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

  // Next round after delay
  state.round++;
  setTimeout(loadRound, 1600);
}

// ---- End game ----
function endGame() {
  // Stop any playing audio
  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio = null;
  }

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

  // Disable buttons initially
  $$('.diff-btn').forEach(b => b.disabled = true);

  // Name input validation
  $('#player-name').addEventListener('input', validateName);

  // Difficulty buttons
  $$('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      startGame(btn.dataset.difficulty);
    });
  });

  // Play button — toggle play/pause/replay
  $('#play-btn').addEventListener('click', toggleAudio);

  // Answer form
  $('#answer-form').addEventListener('submit', (e) => {
    e.preventDefault();
    submitAnswer();
  });

  // Play again
  $('#play-again-btn').addEventListener('click', () => {
    showScreen('landing');
  });

  // Enter key on name input
  $('#player-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if ($('#player-name').value.trim()) {
        $('.diff-btn').focus();
      } else {
        showNameHint();
      }
    }
  });
});
