let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameActive = true;
let mode = "two";

const boardDiv = document.getElementById("board");
const statusText = document.getElementById("status");

function drawBoard(){
  boardDiv.innerHTML="";
  board.forEach((cell,i)=>{
    let div=document.createElement("div");
    div.className="cell";
    div.innerText=cell;
    div.onclick=()=>move(i);
    boardDiv.appendChild(div);
  });
}
drawBoard();

function setMode(m){
  mode=m;
  resetGame();
}

function move(i){
  if(board[i]!=="" || !gameActive) return;

  board[i]=currentPlayer;
  drawBoard();

  if(checkWinner()){
    statusText.innerText=currentPlayer+" Wins!";
    gameActive=false;
    return;
  }

  if(!board.includes("")){
    statusText.innerText="Draw!";
    gameActive=false;
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
  else if(mode==="medium"){
    if(Math.random()<0.6){
      moveIndex=bestMove();
    } else{
      moveIndex=randomMove();
    }
  }

  board[moveIndex]="O";
  drawBoard();

  if(checkWinner()){
    statusText.innerText="O Wins!";
    gameActive=false;
    return;
  }

  if(!board.includes("")){
    statusText.innerText="Draw!";
    gameActive=false;
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
  let result=checkWinnerMini(b);
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
  } else{
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

function checkWinner(){
  return checkWinnerMini(board);
}

function checkWinnerMini(b){
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

function resetGame(){
  board=["","","","","","","","",""];
  currentPlayer="X";
  gameActive=true;
  statusText.innerText="";
  drawBoard();
}
