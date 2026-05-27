const QUESTIONS = [
  { q: "2 + 2", a: "4" },
  { q: "5 × 3", a: "15" },
  { q: "Capital of France", a: "paris" },
  { q: "cowboy", a: "b bop" },
  { q: "cyber", a: "punk" },
  { q: "Capital of France", a: "paris" },
  { q: "Capital of France", a: "paris" },
  { q: "Capital of France", a: "paris" },
  { q: "space", a: "cowboy" },
  { q: "intel", a: "processor" },
  { q: "H₂O = ?", a: "water" }
  
];

const arena = document.getElementById('arena');
const input = document.getElementById('type-input');
let activeTiles = [];

function spawnTile() {
  const randomQ = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  
  const el = document.createElement('div');
  el.className = 'word-tile';
  el.textContent = randomQ.q;
  
  // Constrain random placement within container boundaries
  const randomX = Math.floor(Math.random() * (arena.clientWidth - 120));
  el.style.left = randomX + 'px';
  el.style.top = '0px';
  arena.appendChild(el);

  activeTiles.push({
    element: el,
    answer: randomQ.a.toLowerCase(),
    y: 0
  });
}

function gameLoop() {
  // Update falling movement
  for (let i = activeTiles.length - 1; i >= 0; i--) {
    const tile = activeTiles[i];
    tile.y += .5; // Constant falling speed
    tile.element.style.top = tile.y + 'px';

    // Clear element if it falls past view limits
    if (tile.y > arena.clientHeight) {
      tile.element.remove();
      activeTiles.splice(i, 1);
    }
  }
  requestAnimationFrame(gameLoop);
}

// Check input for match targets
input.addEventListener('input', () => {
  const currentText = input.value.trim().toLowerCase();

  for (let i = 0; i < activeTiles.length; i++) {
    if (currentText === activeTiles[i].answer) {
      // Cut / Eliminate matched tile
      activeTiles[i].element.remove();
      activeTiles.splice(i, 1);
      input.value = ''; // Clean input instantly
      break;
    }
  }
});

// Start loop executions
setInterval(spawnTile, 2500);
requestAnimationFrame(gameLoop);