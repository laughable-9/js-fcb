// variables are storage of values
let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048exist = false;
let is4096exist = false;
let is8192exist = false;

let startX = 0;
let startY = 0;

function setGame(){
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

  for(let r=0; r < rows; r++){
    for(let c=0; c < columns; c++){
      //create and design a tile

      let tile = document.createElement("div");

      tile.id = r.toString() + "-" + c.toString();

      let num = board[r][c];

      updateTile(tile, num);

      document.getElementById("board").append(tile);
    }
  }

  setTwo();
  setTwo();
}

function updateTile(tile, num){

  tile.innerText = "";
  tile.classList.value = "";

  tile.classList.add("tile");
  
  if (num > 0){
    tile.innerText = num.toString();

    if (num<=4096){
      tile.classList.add("x" + num.toString());
    }
    else {
      tile.classList.add("x8192");
    }
  }


}

window.onload = function(){
  setGame();
};  

function handleSlide(event){
  console.log(event.code);

  if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)){

    event.preventDefault(); // Prevents the default behavior

    if (event.code == "ArrowLeft"){
      slideLeft();
      setTwo();
    }
    else if(event.code == "ArrowRight"){
      slideRight();
      setTwo();
    }
    else if (event.code == "ArrowUp"){
      slideUp();
      setTwo();
    }
    else if (event.code == "ArrowDown"){
      slideDown();
      setTwo();
    }
    document.getElementById("score").innerText = score;
  }

  checkWin();

  if (hasLost() == true){
    alert("GAME OVER! You have lost the game. Game will restart.");
    restartGame();
    alert("Click any arrow key to restart");
  }
}

document.addEventListener("keydown", handleSlide);

function slideLeft(){
  for (let r=0; r<rows;r++){
    let row = board[r];
    let originalRow = row.slice();
    row = slide(row); // slideLeft() uses slide() to merge tiles with same values.
    board[r] = row;

    for(let c = 0; c<columns; c++){

      // This code is to retrieve our tile element
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];

      if (originalRow[c] !== num && num!==0){

        tile.style.animation = "slide-from-right 0.3s";
        setTimeout(() => {
          tile.style.animation = ""
        }, 300);
      }

      // Updates the appearance of the tile
      updateTile(tile, num);
    }
  }
}

function slideRight(){
  for (let r=0; r<rows;r++){
    let row = board[r];
    let originalRow = row.slice();
    row.reverse();
    row = slide(row); // slideRight() uses slide() to merge tiles with same values.
    row.reverse();
    board[r] = row;

    for(let c = 0; c<columns; c++){

      // This code is to retrieve our tile element
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];

      if (originalRow[c] !== num && num!==0){

        tile.style.animation = "slide-from-left 0.3s";
        setTimeout(() => {
          tile.style.animation = ""
        }, 300);
      }

      // Updates the appearance of the tile
      updateTile(tile, num);
    }
  }
}

function slideUp(){

	for(let c=0; c<columns; c++){

		let col = [ board[0][c], board[1][c], board[2][c], board[3][c] ];

		let originalCol = col.slice();
		col = slide(col); // slideUp() function uses slide() function to merge tiles with the same values.

		let changeIndices = [];
		for(let c=0; c<columns; c++){
			if(originalCol[c] !== col[c]){
				changeIndices.push(c);
			}
		}
		
		for(let r = 0; r<rows; r++){

			board[r][c] = col[r];

			// this code is the retrieve our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());

			let num = board[r][c];

			if(changeIndices.includes(c) && num!==0){
				tile.style.animation = "slide-from-bottom 0.3s";
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}

			// Updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}

function slideDown(){
  for (let c=0; c<columns;c++){
    let col = [ board[0][c], board[1][c], board[2][c], board[3][c] ];
    let originalCol = col.slice();
    col.reverse();
    col = slide(col); // slideDown() uses slide() to merge tiles with same values.
    col.reverse();

    let changeIndices = [];
		for(let c=0; c<columns; c++){
			if(originalCol[c] !== col[c]){
				changeIndices.push(c);
			}
		}
    
    for(let r = 0; r<rows; r++){

      board[r][c] = col[r];
      // This code is to retrieve our tile element
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];

      if(changeIndices.includes(c) && num!==0){
				tile.style.animation = "slide-from-top 0.3s";
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}

      // Updates the appearance of the tile
      updateTile(tile, num);
    }
  }
}

function filterZero(row){
  return row.filter(num => num != 0);
}

function slide(row){
  row = filterZero(row);
  for(let i=0; i<row.length - 1; i++){
    if(row[i] == row[i+1]){
      row[i] *= 2;
      row[i+1] = 0;
      score += row[i];
    }
  }

  while(row.length < columns){
    row.push(0);
  }
  return row;


}

function hasEmptyTile(){
	
	for(let r=0; r<rows; r++){
		for(let c=0; c<rows; c++){
      if (board[r][c] == 0){
        return true
      }

		}
    return false;
	}
}

function setTwo(){

	// if hasEmptyTile() function returns false, the setTwo() function will not generate a new tile.
	if(hasEmptyTile() == false){
		return; // "I will do nothing, I don't need to generate a new tile"
	}

	// the codes below are the codes to be executed once the condition above is not satisfied. 
	let found = false;

	while(!found){

		// This is to generate a random row and column position to check a random tile, and generate a tile with number 2 in it.
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		// if the random tile is an empty tile, the program will make it a tile with number 2. 
		if(board[r][c]==0){

			// the random vacant becomes 2 
			board[r][c] = 2;

			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");

			found = true;
		}
	}

}

function checkWin(){
  for(let r=0; r<rows; r++){
		for(let c=0; c<rows; c++){
      if (board[r][c] == 2048 && is2048exist == false){
        alert("You win! You got 2048.");
        is2048exist = true;
      } else if (board[r][c] == 4096 && is4096exist == false){
        alert("You got 4096, amazing!");
        is4096exist = true;
      } else if (board[r][c] == 8192 && is8192exist == false){
        alert("You are impossible. 8192!");
        is8192exist = true;
      }
	  }
  } 
}

function hasLost(){
  for(let r=0; r<rows; r++){
		for(let c=0; c<rows; c++){
      if (board[r][c] == 0){
        return false;
      }
    
      const currentTile = board[r][c];
      if(
        r > 0 && board[r-1][c] === currentTile ||
        r < rows - 1 && board[r+1][c] === currentTile ||
        c > 0 && board[r][c-1] === currentTile ||
        c < columns - 1 && board[r][c+1] === currentTile
      ){
        return false;
      }
    }
  }
  return true;
}

// RestartGame by replacing all values into zero.
function restartGame(){
  for(let r = 0; r < rows; r++){
      for(let c = 0; c < columns; c++){
          board[r][c] = 0;    // change all values to 0
      }
  }
  score = 0;
  setTwo()    // new tile   
}

document.addEventListener('touchstart', (event) => {
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
})

document.addEventListener('touchend', (event) => {
  if (!event.target.className.includes("tile")){
    return;
  }

  let diffX = startX - event.changedTouches[0].clientX;
  let diffY = startY - event.changedTouches[0].clientY;
  if (Math.abs(diffX) > Math.abs(diffY)){
    if (diffX > 0) {
      slideLeft();
      setTwo();
    } else{
      slideRight();
      setTwo();
    }
  }
  else {
    if (diffY > 0) {
      slideUp();
      setTwo();
    } else{
      slideDown();
      setTwo();
    }
  }

  document.getElementById("score").innerText = score;
  checkWin();

  if (hasLost() == true){
    alert("GAME OVER! You have lost the game. Game will restart.");
    restartGame();
    alert("Swipe again to restart");
  }
})

document.addEventListener('touchmove', (event) => {
  if (!event.target.className.includes("tile")){
    return;
  }
  event.preventDefault();
}, {passive: false});