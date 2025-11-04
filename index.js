// puppy bowl project i think?
const cohort = "2510-KATELYN";
const baseUrl = `https://fsa-puppy-bowl.herokuapp.com/api/${cohort}`;

// get all puppies
async function getPlayers() {
  try {
    const res = await fetch(baseUrl + "/players");
    const data = await res.json();
    console.log("players:", data);
    return data.data.players;
  } catch (err) {
    console.log("error getting players", err);
  }
}

// get teams
async function getTeams() {
  try {
    const res = await fetch(baseUrl + "/teams");
    const data = await res.json();
    console.log("teams:", data);
    return data.data.teams;
  } catch (err) {
    console.log("error loading teams", err);
  }
}

// show all puppies on page
function showPlayers(players) {
  let list = document.getElementById("players-list");
  list.innerHTML = "";

  for (let i = 0; i < players.length; i++) {
    let pup = players[i];
    let li = document.createElement("li");

    let img = document.createElement("img");
    img.src = pup.imageUrl;
    img.alt = pup.name;

    let name = document.createElement("p");
    name.textContent = pup.name;

    li.appendChild(img);
    li.appendChild(name);

    li.addEventListener("click", function () {
      showDetails(pup);
    });

    list.appendChild(li);
  }
}

// show details when you click
function showDetails(puppy) {
  document.getElementById("no-selection").style.display = "none";
  document.getElementById("player-details").style.display = "block";

  document.getElementById("player-image").src = puppy.imageUrl;
  document.getElementById("player-name").textContent = puppy.name;
  document.getElementById("player-id").textContent = puppy.id;
  document.getElementById("player-breed").textContent = puppy.breed;
  document.getElementById("player-status").textContent = puppy.status;

  if (puppy.team) {
    document.getElementById("player-team").textContent = puppy.team.name;
  } else {
    document.getElementById("player-team").textContent = "none";
  }

  let removeBtn = document.getElementById("remove-btn");
  removeBtn.onclick = async function () {
    let sure = confirm("do you want to remove " + puppy.name + "?");
    if (sure) {
      await removePuppy(puppy.id);
    }
  };
}

// delete puppy
async function removePuppy(id) {
  try {
    let res = await fetch(baseUrl + "/players/" + id, {
      method: "DELETE",
    });
    let data = await res.json();
    console.log("deleted:", data);
    alert("puppy gone :(");
    start();
  } catch (err) {
    console.log("delete didnt work", err);
  }
}

// add new puppy
let form = document.getElementById("add-puppy-form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  console.log("form submitted");

  let newPuppy = {
    name: form.name.value,
    breed: form.breed.value,
    status: form.status.value,
    imageUrl: form.image.value,
    teamId: form.team.value,
  };

  try {
    let res = await fetch(baseUrl + "/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPuppy),
    });
    let data = await res.json();
    console.log("added new puppy", data);
    alert("yay new puppy added!!");
    form.reset();
    start();
  } catch (err) {
    console.log("add puppy fail", err);
  }
});

// paw print thing i copied from online
let lastPaw = 0;
document.addEventListener("mousemove", function (e) {
  let now = Date.now();
  if (now - lastPaw < 160) return;
  lastPaw = now;

  let paw = document.createElement("div");
  paw.textContent = "🐾";
  paw.classList.add("pawprint");
  paw.style.left = e.pageX + "px";
  paw.style.top = e.pageY + "px";
  paw.style.fontSize = 1.5 + Math.random() + "rem";
  document.body.appendChild(paw);

  setTimeout(function () {
    paw.remove();
  }, 1200);
});

// start app
async function start() {
  console.log("starting app...");
  let players = await getPlayers();
  let teams = await getTeams();
  showPlayers(players);
  let select = document.getElementById("team-select");
  select.innerHTML = "<option value=''>none</option>";
  for (let i = 0; i < teams.length; i++) {
    let t = teams[i];
    let opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.name;
    select.appendChild(opt);
  }
}

start();
