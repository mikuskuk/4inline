"use strict";
const size = 10;

const board = document.querySelector('.board');
board.style.fontSize = (16 * 4 / size) + 'px';
let state = {
  symbol: 'o',
  moves: {}
};

const storage_name = 'four_in_line';


if (localStorage.getItem(storage_name) != null) {
  state = JSON.parse(localStorage.getItem(storage_name));
}

for (let index = 0; index < (size * size); index++) {
  const template = document.querySelector('.template.cell');
  const cell = template.cloneNode();
  cell.classList.remove('template');

  cell.textContent = state.moves[index];

  // {
  //   const column = index % size;
  //   const row = (index - column) / size;

  //   const diog2 = column - row + size -1;

  //   cell.textContent = diog2 * size + row;
  // }

  cell.onclick = function () {
    if (
      index < size * (size - 1) && //tā nav apakšējā rinda un
      state.moves[index + size] == undefined //šūnu zemāk nav vērtības
    ) {
      return;
    }

    const move = state.moves[index];
    if (move != undefined) return;
    state.symbol = (state.symbol == 'x') ? 'o' : 'x';

    this.textContent = state.symbol;
    state.moves[index] = state.symbol;
    localStorage.setItem(storage_name, JSON.stringify(state));

    if (checkWinner()) {
      displayMessage('Player: "' + state.symbol + '" has won!');
    }
  }
  board.append(cell);
}


document.querySelector('.reset').onclick = resetHandle;

/**
 * @return true - ir uzvarētājs, false - uzvarētāja nav
 */
function checkWinner() {

  let moves_row_grouped = {};
  let moves_diog1_group = {};
  let moves_diog2_group = {};

  for (let index = 0; index < Object.keys(state.moves).length; index++) {
    const key = Object.keys(state.moves)[index];
    const column = key % size;
    const row = (key - column) / size;
    const move = state.moves[key];

    {
      const diog1 = column + row;
      const diog1_key = diog1 * size + row;
      moves_diog1_group[diog1_key] = move;
    }

    {
      const diog2 = column - row + size - 1;
      const diog1_key = diog2 * size + row;

      moves_diog2_group[diog1_key] = move; 
      
    }
    moves_row_grouped[column * 10 + row] = move;
  }

  console.log(state.moves);
  console.log(moves_row_grouped);
  console.log(moves_diog1_group);

  if (checkLine(state.moves)) return true;
  if (checkLine(moves_row_grouped)) return true;
  if (checkLine(moves_diog1_group)) return true;
  if (checkLine(moves_diog2_group)) return true;

  return false;
}

function checkLine(moves) {
  let test_move;
  let test_column;
  let test_row;
  let count_l = 0;

  for (let index = 0; index < Object.keys(moves).length; index++) {
    const key = Object.keys(moves)[index];

    const column = key % size;
    const row = (key - column) / size;

    const move = moves[key];

    if (move == test_move && (test_column + 1) == column && test_row == row) {
      count_l++;
    }
    else {
      count_l = 0;
    }

    test_move = move;
    test_column = Number(column);
    test_row = Number(row);


    if (count_l == 3) {
      return true;
    }
  }
}

function resetHandle() {
  displayMessage('');
  const cells = board.children;

  for (let index = 0; index < cells.length; index++) {
    const cell = cells[index];
    cell.textContent = '';
  }

  state = {
    symbol: 'o',
    moves: {}
  };

  localStorage.setItem(storage_name, JSON.stringify(state));
}

function displayMessage(message) {
  document.querySelector('.message').textContent = message;
}


/**

 */







