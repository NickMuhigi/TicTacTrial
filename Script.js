'use strict';

// Check if the current page is the game page based on its URL
const isGamePage = window.location.pathname.includes('game.html');

// Function to start the game
function startGame() {
  const playerName = document.getElementById('playerName').value.trim();
  if (playerName) {
    // Store player name in localStorage for persistence
    localStorage.setItem('playerName', playerName);
    // Redirect to game page
    window.location.href = './game.html';
  } else {
    alert('Please enter your name to start the game.');
  }
}

// Function to initialize the game page
function initGamePage() {
  const playerName = localStorage.getItem('playerName');
  if (playerName) {
    document.getElementById('playerName').textContent = playerName;
  } else {
    // Redirect to initial page if playerName is not found
    window.location.href = './index.html';
  }

  // Add event listeners for game interactions (e.g., clicking on the board, reset button)
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });

  const resetButton = document.getElementById('reset');
  resetButton.addEventListener('click', resetGame);
}

// Game variables
let currentPlayer = 'X';
const board = new Array(9).fill(null);
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Function to handle cell clicks
function handleCellClick(e) {
  const cellId = parseInt(e.target.id.split('-')[1]);
  if (!board[cellId]) {
    e.target.textContent = currentPlayer;
    board[cellId] = currentPlayer;
    if (checkWin(currentPlayer)) {
      displayMessage(`Congratulations! ${currentPlayer} wins!`);
      highlightWinningCells();
      disableBoard();
    } else if (checkDraw()) {
      displayMessage("It's a draw!");
      disableBoard();
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
  }
}

// Function to check for a win
function checkWin(player) {
  return winConditions.some(condition => {
    return condition.every(index => {
      return board[index] === player;
    });
  });
}

// Function to check for a draw
function checkDraw() {
  return board.every(cell => cell !== null);
}

// Function to display game messages
function displayMessage(message) {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageElement.classList.add('game-message');
  document.querySelector('.game-container').appendChild(messageElement);
}

// Function to highlight winning cells
function highlightWinningCells() {
  winConditions.forEach(condition => {
    const [a, b, c] = condition;
    const cells = document.querySelectorAll(`#col-${a}, #col-${b}, #col-${c}`);
    cells.forEach(cell => {
      cell.classList.add('win');
    });
  });
}

// Function to disable the game board after game ends
function disableBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.removeEventListener('click', handleCellClick);
  });
}

// Function to reset the game
function resetGame() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('win');
  });
  board.fill(null);
  currentPlayer = 'X';
  document.querySelector('.game-message').remove();
  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });
}

// Main logic to determine page initialization
if (!isGamePage) {
  // If it's the initial page (index.html), add event listener to start game button
  const startGameButton = document.getElementById('startGame');
  startGameButton.addEventListener('click', startGame);
} else {
  // If it's the game page (game.html), initialize game setup
  initGamePage();
}
