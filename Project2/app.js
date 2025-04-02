async function fetchTopRatedGames() {
  try {
    const url = `https://api.rawg.io/api/games?key=ed07387a3a404e0097a52f0d223c139a&dates=2000-01-01,2025-04-02&ordering=-released&page_size=10`;

    const response = await fetch(url);
    if (!response.ok) {
      console.log(`Error fetching games: ${response.status}`);
      return;
    }

    const data = await response.json();
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = '';

    if (!data.results || data.results.length === 0) {
      gameGrid.innerHTML = '<p>No top-rated games found.</p>';
      return;
    }

    data.results.forEach(game => {
      const gameItem = document.createElement('div');
      gameItem.classList.add('game-item');

      const gameImage = game.background_image;

      gameItem.innerHTML = `
        <img src="${gameImage}" alt="${game.name}" style="width: 100%; border-radius: 8px;">
        <h3>${game.name}</h3>
        <p>Released: ${game.released}</p>
        <p>Genre: ${game.genres.map(genre => genre.name).join(', ')}</p>
      `;
      gameGrid.appendChild(gameItem);
    });
  } catch (error) {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = `<p>Error fetching games: ${error.message}</p>`;
    console.error('Error fetching top-rated games:', error);
  }
}

async function fetchTrivia() {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple&category=15');
    if (!response.ok) {
      console.log(`Error fetching trivia: ${response.status}`);
      return;
    }

    const data = await response.json();
    const trivia = data.results[0];

    const triviaQuestion = document.getElementById('trivia-question');
    triviaQuestion.innerHTML = `<p>${trivia.question}</p>`;

    const triviaAnswers = document.getElementById('trivia-answers');
    triviaAnswers.innerHTML = '';
    const allAnswers = [...trivia.incorrect_answers, trivia.correct_answer];

    allAnswers.sort(() => Math.random() - 0.5);

    allAnswers.forEach(answer => {
      const answerButton = document.createElement('button');
      answerButton.textContent = answer;
      answerButton.onclick = () => alert(answer === trivia.correct_answer ? 'Correct!' : 'Try again');
      triviaAnswers.appendChild(answerButton);
    });
  } catch (error) {
    const triviaQuestion = document.getElementById('trivia-question');
    triviaQuestion.innerHTML = `<p>Error fetching trivia: ${error.message}</p>`;
    console.error('Error fetching trivia:', error);
  }
}


fetchTopRatedGames();
fetchTrivia();
