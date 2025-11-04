// ===== CONFIG =====
const COHORT = "2510-KATELYN";
const BASE_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${COHORT}`;

// ===== API HELPERS =====
async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST failed at ${path}`);
  return res.json();
}

async function apiDelete(path) {
  const res = await fetch(`${BASE_URL}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`DELETE failed at ${path}`);
  return res.json();
}

// ===== FETCH DATA =====
async function getAllPlayers() {
  const payload = await apiGet("/players");
  return payload.data.players || [];
}

async function getTeams() {
  const payload = await apiGet("/teams");
  return payload.data.teams || [];
}

// ===== RENDER =====
function renderPlayers(players) {
  const list = document.getElementById("players-list");
  list.innerHTML = "";

  players.forEach((p) => {
    const li = document.createElement("li");
    li.className = "player-item";
    li.dataset.id = p.id;

    const img = document.createElement("img");
    img.src = p.imageUrl || "https://place-puppy.com/200x200";
    img.alt = p.name || "Puppy";
    li.appendChild(img);

    const span = document.createElement("span");
    span.textContent = p.name;
    li.appendChild(span);

    li.addEventListener("click", () => showPlayerDetails(p));
    list.appendChild(li);
  });
}

function renderTeams(teams) {
  const select = document.getElementById("team-select");
  select.innerHTML = '<option value="">Unassigned</option>';

  teams.forEach((team) => {
    const opt = document.createElement("option");
    opt.value = team.id;
    opt.textContent = team.name;
    select.appendChild(opt);
  });
}

// ===== PLAYER DETAILS =====
function showPlayerDetails(player) {
  document.getElementById("no-selection").classList.add("hidden");
  document.getElementById("player-details").classList.remove("hidden");

  document.getElementById("player-image").src = player.imageUrl || "";
  document.getElementById("player-name").textContent = player.name || "Unnamed";
  document.getElementById("player-id").textContent = player.id || "";
  document.getElementById("player-breed").textContent = player.breed || "";
  document.getElementById("player-status").textContent = player.status || "";
  document.getElementById("player-team").textContent =
    player.team?.name || "Unassigned";
  // 🐾 Pawprint cursor trail effect
  let lastPawTime = 0;

  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    // limit how often paws appear (every 120ms)
    if (now - lastPawTime < 120) return;
    lastPawTime = now;

    const paw = document.createElement("div");
    paw.textContent = "🐾";
    paw.className = "pawprint";

    // random slight variation for realism
    const size = 1.5 + Math.random() * 0.8; // 1.5–2.3rem
    const offsetX = (Math.random() - 0.5) * 40; // horizontal wiggle
    paw.style.left = `${e.pageX + offsetX}px`;
    paw.style.top = `${e.pageY}px`;
    paw.style.fontSize = `${size}rem`;

    document.body.appendChild(paw);

    // remove paw after animation
    setTimeout(() => paw.remove(), 1200);
  });

  const removeBtn = document.getElementById("remove-btn");
  removeBtn.onclick = async () => {
    if (confirm(`Remove ${player.name}?`)) {
      await removePlayer(player.id);
    }
  };
}

// ===== REMOVE PLAYER =====
async function removePlayer(id) {
  try {
    await apiDelete(`/players/${id}`);
    alert("Puppy removed!");
    init(); // reload list
  } catch (err) {
    console.error("Remove failed:", err);
  }
}

// ===== ADD PLAYER FORM =====
const form = document.getElementById("add-puppy-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPup = {
    name: form.name.value,
    breed: form.breed.value,
    status: form.status.value,
    imageUrl: form.image.value,
    teamId: form.team.value || null,
  };

  try {
    await apiPost("/players", newPup);
    form.reset();
    alert("New puppy invited!");
    init();
  } catch (err) {
    console.error("Add puppy failed:", err);
  }
});

// ===== MAIN INIT =====
async function init() {
  try {
    const [players, teams] = await Promise.all([getAllPlayers(), getTeams()]);
    renderPlayers(players);
    renderTeams(teams);
  } catch (err) {
    console.error("Failed to load data:", err);
  }
}

init();
