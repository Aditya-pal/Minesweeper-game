var board = [];
var rows = 8;
var columns = 8;

var mineCount = 5;
var mineLocation = [];

var tileClicked = 0;
var flagEnabled = false;

var gameOver = false;

window.onload = function () {
  startGame();
};

function setMines() {
  // mineLocation.push("2-2");
  // mineLocation.push("2-3");
  // mineLocation.push("5-6");
  // mineLocation.push("3-4");
  // mineLocation.push("1-1");

  let minesLeft = mineCount;
  while (minesLeft > 0) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    let id = r.toString() + "-" + c.toString();

    if (!mineLocation.includes(id)) {
      mineLocation.push(id);
      minesLeft -= 1;
    }
  }
}

function startGame() {
  document.getElementById("mines-count").innerText = mineCount;
  document.getElementById("flag-button").addEventListener("click", setFlag);
  setMines();
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      tile.addEventListener("click", clickTile);
      document.getElementById("board").append(tile);
      row.push(tile);
    }
    board.push(row);
  }
  console.log(board);
}

function setFlag() {
  if (flagEnabled) {
    flagEnabled = false;
    document.getElementById("flag-button").style.backgroundColor = "lightgrey";
  } else {
    flagEnabled = true;
    document.getElementById("flag-button").style.backgroundColor = "darkgrey";
  }
}

function clickTile() {
  if (gameOver || this.classList.contains("tile-clicked")) {
    return;
  }

  let tile = this;

  if (flagEnabled) {
    if (tile.innerText == "") {
      tile.innerText = "🚩";
    } else if (tile.innerText == "🚩") {
      tile.innerText = "";
    }
    return;
  }

  if (mineLocation.includes(tile.id)) {
    alert("GAME OVER");
    gameOver = true;
    revealMines();
    return;
  }

  let coords = tile.id.split("-");
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);
  checkMine(r, c);
}

function revealMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = board[r][c];
      if (mineLocation.includes(tile.id)) {
        tile.innerText = "💣";
        tile.style.backgroundColor = "red";
      }
    }
  }
}

function checkMine(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return;
  }
  if (board[r][c].classList.contains("tile-clicked")) {
    return;
  }

  board[r][c].classList.add("tile-clicked");
  tileClicked += 1;

  let minesFound = 0;

  //top
  minesFound += checkTile(r - 1, c - 1); //top left
  minesFound += checkTile(r - 1, c); //top
  minesFound += checkTile(r - 1, c + 1); //top right

  // left and right
  minesFound += checkTile(r, c - 1); //left
  minesFound += checkTile(r, c + 1); //right

  //bottom
  minesFound += checkTile(r + 1, c - 1); //bottom left
  minesFound += checkTile(r + 1, c); //bottom
  minesFound += checkTile(r + 1, c + 1); //bottom right

  if (minesFound > 0) {
    board[r][c].innerText = minesFound;
    board[r][c].classList.add("x" + minesFound.toString());
  } else {
    checkMine(r - 1, c - 1);
    checkMine(r - 1, c);
    checkMine(r - 1, c + 1);

    checkMine(r, c - 1);
    checkMine(r, c + 1);

    checkMine(r + 1, c - 1);
    checkMine(r + 1, c);
    checkMine(r + 1, c + 1);
  }

  if (tileClicked == rows * columns - mineCount) {
    document.getElementById("mines-count").innerText = "Cleared";
    gameOver = true;
  }
}

function checkTile(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return 0;
  }
  if (mineLocation.includes(r.toString() + "-" + c.toString())) {
    return 1;
  }
  return 0;
}
