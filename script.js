let board;
let currentPlayer;
let gameActive;
let mode;

const boardDiv=document.getElementById("board");
const statusText=document.getElementById("status");
const menu=document.getElementById("menu");
const game=document.getElementById("game");

function startGame(selectedMode){
  mode=selectedMode;
  menu.classList.add("hidden");
  game.classList.remove("hidden");
  initGame();
}

function initGame(){
  board=["","","","","","","","",""];
  currentPlayer="X";
  gameActive=true;
  statusText.innerText="";
  drawBoard();
}

function drawBoard(){
  boardDiv.innerHTML="";
  board.forEach((cell,i)=>{
    const div=document.createElement("div");
    div.className="cell";
    div.innerText=cell;
    div.onclick=()=>move(i);
    boardDiv.appendChild(div);
  });
}

function move(i){
  if(board[i]!=="" || !gameActive) return;

  board[i]=currentPlayer;
  drawBoard();

  let result=checkWinner(board);
  if(result){
    endGame(result);
    return;
  }

  currentPlayer=currentPlayer==="X"?"O":"X";

  if(currentPlayer==="O" && mode!=="two"){
    setTimeout(aiMove,400);
  }
}

function aiMove(){
  let moveIndex;

  if(mode==="hard"){
    moveIndex=bestMove();
  }
  else{
    if(Math.random()<0.6){
      moveIndex=bestMove();
    }else{
      moveIndex=randomMove();
    }
  }

  board[moveIndex]="O";
  drawBoard();

  let result=checkWinner(board);
  if(result){
    endGame(result);
    return;
  }

  currentPlayer="X";
}

function randomMove(){
  let empty=board
  .map((v,i)=>v===""?i:null)
  .filter(v=>v!==null);

  return empty[Math.floor(Math.random()*empty.length)];
}

function bestMove(){
  let bestScore=-Infinity;
  let move;

  for(let i=0;i<9;i++){
    if(board[i]===""){
      board[i]="O";
      let score=minimax(board,false);
      board[i]="";
      if(score>bestScore){
        bestScore=score;
        move=i;
      }
    }
  }
  return move;
}

function minimax(b,isMax){
  let result=checkWinner(b);
  if(result!==null){
    const scores={O:1,X:-1,draw:0};
    return scores[result];
  }

  if(isMax){
    let best=-Infinity;
    for(let i=0;i<9;i++){
      if(b[i]===""){
        b[i]="O";
        best=Math.max(best,minimax(b,false));
        b[i]="";
      }
    }
    return best;
  }else{
    let best=Infinity;
    for(let i=0;i<9;i++){
      if(b[i]===""){
        b[i]="X";
        best=Math.min(best,minimax(b,true));
        b[i]="";
      }
    }
    return best;
  }
}

function checkWinner(b){
  const wins=[
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for(let [a,b1,c] of wins){
    if(b[a] && b[a]===b[b1] && b[a]===b[c]){
      return b[a];
    }
  }

  if(!b.includes("")) return "draw";
  return null;
}

function endGame(result){
  gameActive=false;

  if(result==="draw"){
    statusText.innerText="It's a Tie!";
  }else{
    statusText.innerText=result+" Wins!";
  }
}

function playAgain(){
  initGame();
}

function backToMenu(){
  game.classList.add("hidden");
  menu.classList.remove("hidden");
}
