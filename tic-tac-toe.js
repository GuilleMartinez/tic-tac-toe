// ********************* GAME OBJECTS ***********************************
const HTML_ELEMENTS = {
  _board: document.getElementById("game-board"),
  _player: document.getElementById("game-player"),
  _title: document.getElementById("game-title"),
  _resetButton: document.getElementById("game-reset-button"),

  get board() {
    return this._board;
  },

  get title() {
    return this._title;
  },

  get resetButton() {
    return this._resetButton;
  },

  get boardCells() {
    return createArray(this.board.getElementsByTagName("td"));
  },

  /**
   * @param {string} currentPlayer
   */
  set player(currentPlayer) {
    this._player.textContent = currentPlayer;
  },

  /**
   * @param {string} newTitle
   */
  set title(newTitle) {
    this._title.textContent = newTitle;
  },
};

const GAME = {
  _cellsAvailable: 9,
  _canPlay: true,
  _currentPlayer: "❌",
  _nextPlayer: "⚪",

  get canPlay() {
    return this._canPlay;
  },

  get currentPlayer() {
    return this._currentPlayer;
  },

  decrementCellsAvailable() {
    this._cellsAvailable--;
  },

  hasCellsAvailable() {
    return this._cellsAvailable > 0;
  },

  finish() {
    this._canPlay = false;
  },

  swapPlayers() {
    [this._currentPlayer, this._nextPlayer] = [
      this._nextPlayer,
      this._currentPlayer,
    ];
  },
};
// **********************************************************************

// *********************** UTILITY FUNCTIONS ****************************
function verifyCells(cells) {
  return cells.every((cell) => cell.textContent == GAME.currentPlayer);
}

function createArray(elements) {
  return Array.from(elements);
}

function startGame(event) {
  const target = event.target;
  if (target.textContent === "" && GAME.canPlay) {
    target.textContent = GAME.currentPlayer;
    GAME.decrementCellsAvailable();
    checkGameStatus(target);
  }
}

function reloadPage() {
  location.reload();
}
// **********************************************************************

// ******************** CHECK FOR WINNER FUNCTIONS ***********************
function checkGameStatus(cell) {
  const rowCells = checkWinnerByRow(cell.parentElement);
  const sideCells = !rowCells ? checkWinnerBySides(cell.classList) : false;

  const continuePlaying = function () {
    GAME.swapPlayers();
    HTML_ELEMENTS.player = GAME.currentPlayer;
  };

  if (rowCells) styleGame("winner", rowCells);
  else if (sideCells) styleGame("winner", sideCells);
  else if (!GAME.hasCellsAvailable()) styleGame("tie", HTML_ELEMENTS.boardCells);
  else continuePlaying();
}

function checkWinnerByRow(row) {
  const cells = createArray(row.children);
  const haveWinner = verifyCells(cells);
  if (haveWinner) return cells;
  else return false;
}

function checkWinnerBySides(sides) {
  for (const side of sides) {
    const cells = createArray(document.getElementsByClassName(side));
    const haveWinner = verifyCells(cells);
    if (haveWinner) return cells;
  }
  return false;
}
// **********************************************************************

// ************************* STYLING FUNCTIONS **************************
function styleGame(styleType, cells) {
  
  const styleCells = function (cells, className) {
    cells.map(cell => cell.classList.add(className));
  }

  switch (styleType) {
    case "winner":
      styleCells(cells, "board__row__cell--winner-type");
      HTML_ELEMENTS.title = `The winner is ${GAME.currentPlayer}! 🥳`;
      break;

    case "tie":
      styleCells(cells, "board__row__cell--tie-type");
      HTML_ELEMENTS.title = "We have a tie! 🙌";
      break;
  }
  GAME.finish();
}
// **********************************************************************

// ************************** GAME EVENTS *******************************
HTML_ELEMENTS.board.addEventListener("click", startGame);
HTML_ELEMENTS.resetButton.addEventListener("click", reloadPage);
// **********************************************************************
