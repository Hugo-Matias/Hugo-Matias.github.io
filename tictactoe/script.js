const Player = (name, marker) => {
  const getName = () => name;
  const setName = (newName) => (name = newName);
  const getMarker = () => marker;

  return { getMarker, getName, setName };
};

const gameboard = (() => {
  let board = [null, null, null, null, null, null, null, null, null];

  const play = (position, marker) => {
    if (position >= 0 && position < 9) {
      board.splice(position, 1, marker);
    }
  };

  const getBoard = () => board;

  const resetBoard = () => {
    board = board.map((block) => (block = null));
  };

  return { play, getBoard, resetBoard };
})();

const gameManager = (() => {
  const gameOverScreenTimeout = 500;

  // DOM Caching
  const blocks = document.querySelector(".board").querySelectorAll(".block");
  const winScreen = document.querySelector(".win-screen");
  const winScreenTitle = winScreen.querySelector(".win-title");
  const winScreenMsg = winScreen.querySelector(".win-text");
  const winScreenBtn = winScreen.querySelector(".play-btn");

  // Players
  const p1 = Player("Alien", "👽");
  const p2 = Player("Robot", "🤖");

  let activePlayer;

  const resetPlayer = () => (activePlayer = p1);
  const togglePlayer = () => (activePlayer = activePlayer == p1 ? p2 : p1);

  const play = (position) => {
    let board = gameboard.getBoard();
    if (!board[position]) {
      gameboard.play(position, activePlayer.getMarker());
      render();
      board = [...gameboard.getBoard()];
      const score = evaluateBoard(board);
      if (score == 10) {
        setTimeout(() => gameOverScreen(p1), gameOverScreenTimeout);
      } else if (score == -10) {
        setTimeout(() => gameOverScreen(p2), gameOverScreenTimeout);
      } else {
        if (isGameOver(board)) {
          setTimeout(() => gameOverScreen(), gameOverScreenTimeout);
        } else {
          if (activePlayer == p1) {
            aiPlay(getMove(board));
          } else {
            togglePlayer();
          }
        }
      }
    }
  };

  const gameOverScreen = (player) => {
    if (player) {
      winScreenTitle.innerText = `YEAH! ${activePlayer.getMarker()}`;
      winScreenMsg.innerText = `${activePlayer.getName()} ganhou esta ronda!`;
    } else {
      winScreenTitle.innerText = "Empate! 😕";
      winScreenMsg.innerText = "Ninguém ganhou esta ronda!";
    }
    winScreen.classList.add("active");
  };

  // Board
  let gmBoard = [];

  const render = () => {
    const board = gameboard.getBoard();
    blocks.forEach((block) => {
      block.innerText = board[block.attributes.data.value];
    });
  };

  const combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const evaluateBoard = (board) => {
    let scores = [];
    combinations.forEach((comb) => {
      let score = 0;
      comb.forEach((index) => {
        if (board[index] == p1.getMarker()) {
          score += 1;
        } else if (board[index] == p2.getMarker()) {
          score -= 1;
        }
      });
      scores.push(score);
    });
    if (scores.indexOf(3) != -1) return 10;
    else if (scores.indexOf(-3) != -1) return -10;
    else return 0;
  };

  const isGameOver = (board) => {
    const score = evaluateBoard(board);
    if (board.indexOf(null) == -1 || score != 0) {
      return true;
    }
    return false;
  };

  const reset = () => {
    gameboard.resetBoard();
    resetPlayer();
    render();
  };

  // AI
  const minimax = (board, depth, isMax) => {
    if (isGameOver(board)) {
      let boardScore = evaluateBoard(board);
      if (isMax) boardScore -= depth;
      else boardScore += depth;
      return boardScore;
    }

    if (isMax) {
      let bestScore = -9999;
      for (let i = 0; i < 9; i++) {
        if (board[i] == null) {
          board[i] = p1.getMarker();
          bestScore = Math.max(bestScore, minimax(board, depth + 1, !isMax));
          board[i] = null;
        }
      }
      return bestScore;
    } else {
      let bestScore = 9999;

      for (let i = 0; i < 9; i++) {
        if (board[i] == null) {
          board[i] = p2.getMarker();
          bestScore = Math.min(bestScore, minimax(board, depth + 1, !isMax));
          board[i] = null;
        }
      }
      return bestScore;
    }
  };

  const getMove = (board) => {
    let bestScore = 9999;
    let bestMoves = [];
    for (let i = 0; i < 9; i++) {
      if (board[i] == null) {
        board[i] = p2.getMarker();
        let moveScore = minimax(board, 0, true);
        board[i] = null;

        if (moveScore < bestScore) {
          bestMoves = [i];
          bestScore = moveScore;
        } else if (moveScore == bestScore) {
          bestMoves.push(i);
        }
      }
    }
    return bestMoves;
  };

  const aiPlay = (moves) => {
    togglePlayer();
    const moveIndex = Math.floor(Math.random() * moves.length);
    play(moves[moveIndex]);
  };

  // Events
  blocks.forEach((block) => {
    block.addEventListener("click", (e) =>
      play(e.target.attributes.data.value)
    );
  });

  winScreenBtn.addEventListener("click", () => {
    winScreen.classList.remove("active");
    reset();
  });

  // Init
  reset();

  return {};
})();
