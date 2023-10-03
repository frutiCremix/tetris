import "./style.css";
//1. inicializamos el canvas
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

//score
const scoreHtml = document.querySelector("span");
let score = 0;
//valores del tablero y las piezas
const BLOCK_SIZE = 20;
const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 30;

//dimensionamos el canvas
canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

//escalamos los pixeles para que cuadre con las dimensiones del canvas
context.scale(BLOCK_SIZE, BLOCK_SIZE);
//3. board
const board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
];

//4. pieza player

const piece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1],
  ],
};

//todas las piezas del juego
const PIECES = [
  [
    [1, 1],
    [1, 1],
  ],
  [[1, 1, 1, 1]],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
];

//2. game loop
let dropCounter = 0;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > 1000) {
    piece.position.y++;
    dropCounter = 0;
    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      removeRows();
    }
  }
  draw();
  //le pasa por parametro un valor de time
  window.requestAnimationFrame(update);
}

//dibujamos el canvas
function draw() {
  //fondo del canvas
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  //pintamos cada cuadro del canvas con valores de 1 en amarillo
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value == 1) {
        context.fillStyle = "yellow";
        context.fillRect(x, y, 1, 1);
      }
    });
  });
  //si existen valores de piezas para el player le damos el color rojo
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = "red";
        context.fillRect(piece.position.x + x, piece.position.y + y, 1, 1);
      }
    });
  });
  scoreHtml.innerText = score;
}
//eventos de teclas
document.addEventListener("keydown", (e) => {
  if (e.key == "ArrowLeft") {
    piece.position.x--;
    if (checkCollision()) {
      piece.position.x++;
    }
  }
  if (e.key == "ArrowRight") {
    piece.position.x++;
    if (checkCollision()) {
      piece.position.x--;
    }
  }
  if (e.key == "ArrowDown") {
    piece.position.y++;
    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      removeRows();
    }
  }
  if (e.key == "ArrowUp") {
    //rotamos la pieza. cambiamos las columnas por filas
    const rotate = [];
    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = [];
      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i]);
      }
      rotate.push(row);
    }
    //nos aseguramos que se pueda rotar. si no vuelve a la posicion de rotacion valida anterior
    const previusShape = piece.shape;
    piece.shape = rotate;
    if (checkCollision()) {
      piece.shape = previusShape;
    }
  }
});
//funcion que chekea colision con el tablero y piezas
function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        //posicion absoluta del tablero a partir de la suma de
        //la posicion relativa dentro la pieza y su punto de origen
        //Si board[y + piece.position.y]? es null o undefined,
        // esto evitará errores de acceso a propiedades y simplemente devolverá undefined.
        //quedaria undefined != 0 --> true
        value != 0 && board[y + piece.position.y]?.[x + piece.position.x] != 0
      );
    });
  });
}

function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value == 1) {
        board[y + piece.position.y][x + piece.position.x] = 1;
      }
    });
  });
  //get random piece
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)];
  //reset position
  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2);
  piece.position.y = 0;
  if (checkCollision()) {
    window.alert("GAME OVER!");
    board.forEach((row) => {
      row.fill(0);
    });
  }
}

function removeRows() {
  const rowsToRemove = [];

  board.forEach((row, y) => {
    if (row.every((value) => value == 1)) {
      rowsToRemove.push(y);
    }
  });
  rowsToRemove.forEach((y) => {
    board.splice(y, 1);
    const newRow = Array(BOARD_WIDTH).fill(0);
    board.unshift(newRow);
    score += 10;
  });
}
update();
