const cells = document.querySelectorAll(".cell");
const titleHeader = document.querySelector("#titleHeader");
const xPlayerDisplay = document.querySelector("#xPlayerDisplay");
const oPlayerDisplay = document.querySelector("#oPlayerDisplay");

const newroundBtn = document.querySelector("#newroundBtn");
const restartBtn = document.querySelector("#restartBtn");

const xWinDisplay = document.querySelector(".xWin");
const oWinDisplay = document.querySelector(".oWin");
const drawsDisplay = document.querySelector("#draws");

let player = "X";
let isPauseGame = false;
let isGameStart = false;
let xWin = 0;
let oWin = 0;
let draws = 0;

const inputCells = ["", "", "", "", "", "", "", "", ""];

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => tapCell(cell, index));
});

function tapCell(cell, index) {
  if (cell.textContent === "" && !isPauseGame) {
    isGameStart = true;
    updateCell(cell, index);

    if (!checkWinner()) {
      changePlayer();
      randomPick();
    }
  }
}

function updateCell(cell, index) {
  cell.textContent = player;
  inputCells[index] = player;
  cell.style.color = player === "X" ? "#1892ea" : "#a737ff";
}

function changePlayer() {
  player = player === "X" ? "O" : "X";
  if (player === "X") {
    xPlayerDisplay.classList.add("player-active");
    oPlayerDisplay.classList.remove("player-active");
  } else {
    oPlayerDisplay.classList.add("player-active");
    xPlayerDisplay.classList.remove("player-active");
  }
}

function checkWinner() {
  for (const [a, b, c] of winConditions) {
    if (inputCells[a] === player && inputCells[b] === player && inputCells[c] === player) {
      declareWinner([a, b, c]);
      return true;
    }
  }
  if (inputCells.every((cell) => cell !== "")) {
    declareDraw();
    return true;
  }
  return false;
}

function choosePlayer(selectedPlayer) {
  if (!isGameStart) {
    player = selectedPlayer;
    if (player === "X") {
      xPlayerDisplay.classList.add("player-active");
      oPlayerDisplay.classList.remove("player-active");
    } else {
      oPlayerDisplay.classList.add("player-active");
      xPlayerDisplay.classList.remove("player-active");
    }
  }
}

newroundBtn.addEventListener("click", () => {
  newroundBtn.style.visibility = "hidden";
  inputCells.fill("");
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.style.background = "";
  });
  isPauseGame = false;
  isGameStart = false;
  titleHeader.textContent = "Choose";
});

restartBtn.addEventListener("click", () => {

  restartBtn.style.visibility = "hidden";

  cells.forEach((cell) => {
    cell.innerText = "";
    cell.classList.remove("x", "o");
  });
  xWin = 0;
  oWin = 0;
  draws = 0;

  localStorage.setItem("xWin", 0);
  localStorage.setItem("oWin", 0);
  localStorage.setItem("draws", 0);

  xWinDisplay.innerText = xWin;
  oWinDisplay.innerText = oWin;
  drawsDisplay.innerText = draws;
});

function declareWinner(winningIndices) {
  titleHeader.textContent = `${player} Wins!`;
  isPauseGame = true;

  if (player === "X") {
    xWin++;
    xWinDisplay.textContent = xWin;
    localStorage.setItem("xWin", xWin);
  } else {
    oWin++;
    oWinDisplay.textContent = oWin;
    localStorage.setItem("oWin", oWin);
  }

  winningIndices.forEach((index) => {
    cells[index].style.background = "#2a2343";
  });

  newroundBtn.style.visibility = "visible";
  restartBtn.style.visibility = "visible";
}

window.addEventListener("load", () => {
  xWin = parseInt(localStorage.getItem("xWin")) || 0;
  oWin = parseInt(localStorage.getItem("oWin")) || 0;
  draws = parseInt(localStorage.getItem("draws")) || 0;

  xWinDisplay.textContent = xWin;
  oWinDisplay.textContent = oWin;
  drawsDisplay.textContent = draws;
});

function declareDraw() {
  titleHeader.textContent = "Draw!";
  isPauseGame = true;
  draws++;
  drawsDisplay.textContent = draws;
  localStorage.setItem("draws", draws);
  newroundBtn.style.visibility = "visible";
  restartBtn.style.visibility = "visible";
}

//? edit name of player
document.querySelectorAll(".playerBox").forEach((playerBox, index) => {
  const playerNameSpan = playerBox.querySelector(".player-name");
  const editIcon = playerBox.querySelector(".edit-name");
  const nameInput = playerBox.querySelector(".name-input");
  const localStorageKey = `playerName${index + 1}`;

  const savedName = localStorage.getItem(localStorageKey);
  if (savedName) {
    playerNameSpan.textContent = savedName;
  }

  editIcon.addEventListener("click", () => {
    nameInput.value = playerNameSpan.textContent;
    playerNameSpan.classList.add("hidden");
    nameInput.classList.remove("hidden");
    nameInput.focus();
  });

  nameInput.addEventListener("blur", () => {
    updatePlayerName();
  });

  nameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      updatePlayerName();
    }
  });

  function updatePlayerName() {
    const newName = nameInput.value.trim();
    if (newName) {
      playerNameSpan.textContent = newName;
      localStorage.setItem(localStorageKey, newName);
    }
    playerNameSpan.classList.remove("hidden");
    nameInput.classList.add("hidden");
  }
});
