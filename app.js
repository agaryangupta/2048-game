document.addEventListener("DOMContentLoaded", () => {
    const gridDisplay = document.querySelector(".grid");
    const scoreDisplay = document.querySelector("#score");
    const resultDisplay = document.querySelector("#result");
    const width = 4;
    let squares = [];
    let score = 0;
  
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
  
    function createBoard() {
      for (let i = 0; i < width * width; i++) {
        const square = document.createElement("div");
        square.innerHTML = ""; // Leave the square empty initially
        gridDisplay.appendChild(square);
        squares.push(square);
      }
      generate();
      generate();
    }
  
    createBoard();
  
    function generate() {
      const randomNumber = Math.floor(Math.random() * squares.length);
      if (squares[randomNumber].innerHTML === "") {
        // Check if it's empty
        squares[randomNumber].innerHTML = 2;
      } else {
        generate();
      }
    }
  
    function moveRight() {
      for (let i = 0; i < 16; i++) {
        if (i % 4 === 0) {
          let row = [
            parseInt(squares[i].innerHTML) || 0,
            parseInt(squares[i + 1].innerHTML) || 0,
            parseInt(squares[i + 2].innerHTML) || 0,
            parseInt(squares[i + 3].innerHTML) || 0,
          ];
          let filteredRow = row.filter((num) => num);
          let missing = 4 - filteredRow.length;
          let zeros = Array(missing).fill("");
          let newRow = zeros.concat(filteredRow);
  
          squares[i].innerHTML = newRow[0] || "";
          squares[i + 1].innerHTML = newRow[1] || "";
          squares[i + 2].innerHTML = newRow[2] || "";
          squares[i + 3].innerHTML = newRow[3] || "";
        }
      }
    }
  
    function moveLeft() {
      for (let i = 0; i < 16; i++) {
        if (i % 4 === 0) {
          let row = [
            parseInt(squares[i].innerHTML) || 0,
            parseInt(squares[i + 1].innerHTML) || 0,
            parseInt(squares[i + 2].innerHTML) || 0,
            parseInt(squares[i + 3].innerHTML) || 0,
          ];
          let filteredRow = row.filter((num) => num);
          let missing = 4 - filteredRow.length;
          let zeros = Array(missing).fill("");
          let newRow = filteredRow.concat(zeros);
  
          squares[i].innerHTML = newRow[0] || "";
          squares[i + 1].innerHTML = newRow[1] || "";
          squares[i + 2].innerHTML = newRow[2] || "";
          squares[i + 3].innerHTML = newRow[3] || "";
        }
      }
    }
  
    function moveUp() {
      for (let i = 0; i < 4; i++) {
        let column = [
          parseInt(squares[i].innerHTML) || 0,
          parseInt(squares[i + width].innerHTML) || 0,
          parseInt(squares[i + width * 2].innerHTML) || 0,
          parseInt(squares[i + width * 3].innerHTML) || 0,
        ];
        let filteredColumn = column.filter((num) => num);
        let missing = 4 - filteredColumn.length;
        let zeros = Array(missing).fill("");
        let newColumn = filteredColumn.concat(zeros);
  
        squares[i].innerHTML = newColumn[0] || "";
        squares[i + width].innerHTML = newColumn[1] || "";
        squares[i + width * 2].innerHTML = newColumn[2] || "";
        squares[i + width * 3].innerHTML = newColumn[3] || "";
      }
    }
  
    function moveDown() {
      for (let i = 0; i < 4; i++) {
        let column = [
          parseInt(squares[i].innerHTML) || 0,
          parseInt(squares[i + width].innerHTML) || 0,
          parseInt(squares[i + width * 2].innerHTML) || 0,
          parseInt(squares[i + width * 3].innerHTML) || 0,
        ];
        let filteredColumn = column.filter((num) => num);
        let missing = 4 - filteredColumn.length;
        let zeros = Array(missing).fill("");
        let newColumn = zeros.concat(filteredColumn);
  
        squares[i].innerHTML = newColumn[0] || "";
        squares[i + width].innerHTML = newColumn[1] || "";
        squares[i + width * 2].innerHTML = newColumn[2] || "";
        squares[i + width * 3].innerHTML = newColumn[3] || "";
      }
    }
  
    function combineRow() {
      for (let i = 0; i < 15; i++) {
        if (
          squares[i].innerHTML === squares[i + 1].innerHTML &&
          squares[i].innerHTML !== ""
        ) {
          let combinedTotal =
            parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
          squares[i].innerHTML = combinedTotal;
          squares[i + 1].innerHTML = ""; // Empty after combining
          score += combinedTotal; // Update score after combining
          scoreDisplay.innerHTML = score; // Update score on display
        }
      }
    }
  
    function combineColumn() {
      for (let i = 0; i < 12; i++) {
        if (
          squares[i].innerHTML === squares[i + width].innerHTML &&
          squares[i].innerHTML !== ""
        ) {
          let combinedTotal =
            parseInt(squares[i].innerHTML) +
            parseInt(squares[i + width].innerHTML);
          squares[i].innerHTML = combinedTotal;
          squares[i + width].innerHTML = ""; // Empty after combining
          score += combinedTotal; // Update score after combining
          scoreDisplay.innerHTML = score; // Update score on display
        }
      }
    }
  
    function keyRight() {
      moveRight();
      combineRow();
      moveRight();
      generate();
    }
  
    function keyLeft() {
      moveLeft();
      combineRow();
      moveLeft();
      generate();
    }
  
    function keyUp() {
      moveUp();
      combineColumn();
      moveUp();
      generate();
    }
  
    function keyDown() {
      moveDown();
      combineColumn();
      moveDown();
      generate();
    }
  
    // Keyboard Controls
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") keyLeft();
      if (e.key === "ArrowRight") keyRight();
      if (e.key === "ArrowUp") keyUp();
      if (e.key === "ArrowDown") keyDown();
    });
  
    // Touch Controls
    gridDisplay.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });
  
    gridDisplay.addEventListener("touchmove", (e) => {
      touchEndX = e.touches[0].clientX;
      touchEndY = e.touches[0].clientY; // Fixed typo here
    });
  
    gridDisplay.addEventListener("touchend", () => {
      handleSwipeGesture();
    });
  
    function handleSwipeGesture() {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      const threshold = 30; // Minimum distance to trigger a swipe
  
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        if (diffX > 0) keyRight();
        else keyLeft();
      } else if (
        Math.abs(diffY) > Math.abs(diffX) &&
        Math.abs(diffY) > threshold
      ) {
        if (diffY > 0) keyDown();
        else keyUp();
      }
    }
  
    setInterval(() => {
      squares.forEach((square) => {
        const value = parseInt(square.innerHTML) || 0; // Default to 0 for empty cells
        square.style.backgroundColor =
          value === 0
            ? "#afa192" // If the value is empty (0)
            : value === 2
            ? "#eee4da"
            : value === 4
            ? "#ede0c8"
            : value === 8
            ? "#f2b179"
            : value === 16
            ? "#e8c064"
            : value === 32
            ? "#ffab6e"
            : value === 64
            ? "#f65e3b"
            : value === 128
            ? "#edcf72"
            : value === 256
            ? "#edcc61"
            : value === 512
            ? "#edc850"
            : value === 1024
            ? "#edc53f"
            : "#edc22e";
      });
    }, 50);
  });