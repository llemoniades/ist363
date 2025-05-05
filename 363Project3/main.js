const gameForm = document.getElementById("addGameForm");
const gameTitleInput = document.getElementById("gameTitle");
const gameStatusInput = document.getElementById("gameStatus");
const addStatus = document.getElementById("addStatus");
const gamesGrid = document.getElementById("gamesGrid");
const platformFilter = document.getElementById("platformFilter");
const statusFilter = document.getElementById("statusFilter");

function getGames() {
  return JSON.parse(localStorage.getItem("gamelog_games") || "[]");
}

function saveGames(games) {
  localStorage.setItem("gamelog_games", JSON.stringify(games));
}

function renderGames() {
    if (!gamesGrid) return;
    const games = getGames();
    const platform = platformFilter?.value || "";
    const status = statusFilter?.value || "";
    gamesGrid.innerHTML = "";
  
    const filteredGames = games.filter((g) => {
      const matchesPlatform = !platform || g.platforms?.includes(platform);
      const matchesStatus = !status || g.status === status;
      return matchesPlatform && matchesStatus;
    });
  
    for (const game of filteredGames) {
      const card = document.createElement("div");
      card.className = "border rounded p-4 shadow hover:shadow-md transition flex gap-4";
  
      card.innerHTML = `
        <img src="${game.image || 'placeholder.jpg'}" alt="${game.title}" class="w-16 h-20 object-cover rounded">
        <div>
          <h3 class="text-xl font-bold mb-2">${game.title}</h3>
          <p><strong>Platforms:</strong> ${game.platforms?.join(", ") || "N/A"}</p>
          <label><strong>Status:</strong></label>
          <select class="status-dropdown border rounded p-1 mt-1">
            <option value="Not Started" ${game.status === "Not Started" ? "selected" : ""}>Not Started</option>
            <option value="In Progress" ${game.status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option value="Completed" ${game.status === "Completed" ? "selected" : ""}>Completed</option>
            <option value="Abandoned" ${game.status === "Abandoned" ? "selected" : ""}>Abandoned</option>
          </select>
          <button class="delete-button bg-red-500 text-white px-2 py-1 rounded mt-2 hover:bg-red-600">Delete</button>
        </div>
      `;
  
      const statusDropdown = card.querySelector(".status-dropdown");
      statusDropdown.addEventListener("change", (e) => {
        game.status = e.target.value;
        saveGames(games);
        renderGames();
      });
  
      const deleteButton = card.querySelector(".delete-button");
      deleteButton.addEventListener("click", () => {
        const index = games.indexOf(game);
        if (index > -1) {
          games.splice(index, 1);
          saveGames(games);
          renderGames();
        }
      });
  
      gamesGrid.appendChild(card);
    }
  }

  if (gameForm) {
    gameForm.addEventListener("submit", async (e) => {
      e.preventDefault();
    
      const gameTitle = gameTitleInput.value.trim();
      if (!gameTitle) {
        addStatus.textContent = "Game title is required.";
        return;
      }
    
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games?key=ed07387a3a404e0097a52f0d223c139a&search=${encodeURIComponent(gameTitle)}&dates=2000-01-01,2025-04-02&ordering=-relevance`
        );
        const data = await response.json();
    
        if (!data || !data.results || data.results.length === 0) {
          addStatus.textContent = "Game not found in the database.";
          return;
        }
    
        // Try to find the closest match based on title
        const normalizedInput = gameTitle.toLowerCase();
        const gameData = data.results.find(g => g.name.toLowerCase() === normalizedInput) || data.results[0];
    
        const newGame = {
          title: gameData.name,
          status: gameStatusInput.value,
          platforms: gameData.platforms?.map(p => p.platform.name) || ["Unknown"],
          image: gameData.background_image || "placeholder.jpg"
        };
    
        const games = getGames();
        games.push(newGame);
        saveGames(games);
    
        gameTitleInput.value = "";
        gameStatusInput.value = "Not Started";
        addStatus.textContent = "Game added successfully!";
        renderGames();
        updateDashboardStats();
    
      } catch (error) {
        console.error("Error fetching game data:", error);
        addStatus.textContent = "An error occurred while fetching game data.";
      }
    });
    
  }

if (platformFilter || statusFilter) {
  platformFilter?.addEventListener("change", renderGames);
  statusFilter?.addEventListener("change", renderGames);
  renderGames();
}

const totalGamesEl = document.getElementById("totalGames");
const completedGamesEl = document.getElementById("completedGames");
const inProgressGamesEl = document.getElementById("inProgressGames");
const notStartedGamesEl = document.getElementById("notStartedGames");

function updateDashboardStats() {
  const games = getGames();
  totalGamesEl && (totalGamesEl.textContent = games.length);
  completedGamesEl && (completedGamesEl.textContent = games.filter(g => g.status === "Completed").length);
  inProgressGamesEl && (inProgressGamesEl.textContent = games.filter(g => g.status === "In Progress").length);
  notStartedGamesEl && (notStartedGamesEl.textContent = games.filter(g => g.status === "Not Started").length);
}

updateDashboardStats();
