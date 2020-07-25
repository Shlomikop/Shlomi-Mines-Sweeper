'use strict'



//GLOBAL VARIABLES:
var elSmiley = document.querySelector('.smiley')
var elH3 = document.querySelector('h3')
var sound = document.getElementById('soundV')
var BOMB = '💣'
var FLAG = '🚩'
var gBoard;
var GAMESCOUNT = 0
console.table(gBoard)

var gIntervalGame;
var gLevel = {
    level: [1, 2, 3],
    size: [4, 8, 12],
    mines: [2, 12, 30]
}

var gGame = {
    isOn: false,
    showncount: 0,
    markedCount: 0,
    secsPassed: 0
}
console.log(gGame);

var gCell = {
    minesAroundCount: 0,
    isShown: true,
    isMine: false,
    isMarked: false
}

var gCountMines = 0

var gCurrentSize;

//FUNCTIONS:
console.log(localStorage.getItem('highScore'));


function initGame(size = 4) {
    gGame.isOn = true
    GAMESCOUNT++
    gBoard = buildBoard(size);
    renderBoard(gBoard)
    gCurrentSize = size
    elH3.style.display = 'none'
    elSmiley.src = "smiley.gif"
    console.table(gBoard);
}




// function expandShown(board, elCell, i, j) {}




function buildBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell

        }
    }

    if (size === 4) {
        for (var t = 0; t < 2; t++) {
            if (cell.isMine === false) {
                board[getRandomArbitrary(0, size)][getRandomArbitrary(0, size)].isMine = true
            } else {
                --t
            }
        }
    }
    if (size === 8 && cell.isMine === false) {
        for (var t = 0; t < 12; t++) {
            board[getRandomArbitrary(0, size)][getRandomArbitrary(0, size)].isMine = true

        }
    }
    if (size === 12 && cell.isMine === false) {
        for (var t = 0; t < 30; t++) {
            board[getRandomArbitrary(0, size)][getRandomArbitrary(0, size)].isMine = true

        }

    }


    setMinesNeighsCount(board)
    return board;
}

function setMinesNeighsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j].minesAroundCount = checkNeighbors(board, i, j)
        }
    }
}




function checkNeighbors(board, rowsIdx, colsIdx) {
    var count = 0;
    for (var i = rowsIdx - 1; i <= rowsIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colsIdx - 1; j <= colsIdx + 1; j++) {
            if (j < 0 || j >= board.length) continue;
            if (j === colsIdx && i === rowsIdx) continue;
            if (board[i][j].isMine) count++;
        }
    }

    return count;
}


function renderBoard(board) {

    var strHtml = '';

    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            strHtml += `<td class="cell cell-${i}-${j}" oncontextmenu="cellMarked(${i}, ${j})" onclick="cellClicked(${i}, ${j})">`
            if (cell.isShown) {
                if (cell.isMine) {
                    strHtml += '💣'
                } else {
                    strHtml += `${board[i][j].minesAroundCount}`
                }
            } else {
                if (cell.isMarked) {
                    strHtml += '🚩'
                } else {
                    strHtml += ''
                }
            }
            strHtml += '</td>'
        }
        strHtml += '</tr>'
    }
    var elCellsBoard = document.querySelector('.cells-board')
    elCellsBoard.innerHTML = strHtml



}


var gHintIsOn = false;

function hintIsOn(element) {
    element.style.display = 'none'
    gHintIsOn = true
    return gHintIsOn
}




function cellClicked(i, j) {
    if (gBoard[i][j].isShown) return
    if (!gHintIsOn) {
        startTime()
        var cell = gBoard[i][j]
        cell.isShown = true
        gGame.showncount++
        renderBoard(gBoard)
        win()
        if (gBoard[i][j].isMine) checkGameOver(false)
    } else {
        var shownCells = []
        var cell = gBoard[i][j]
        cell.isShown = true
        gGame.showncount++
        for (var x = i - 1; x <= i + 1; x++) {
            if (x < 0 || x >= gBoard.length) continue;
            for (var k = j - 1; k <= j + 1; k++) {
                if (k < 0 || k >= gBoard.length) continue;
                if (k === j && x === i) continue;
                if (gBoard[i][j].isMine) checkGameOver(false)
                if (gBoard[x][k].isShown === true) shownCells.push({
                    i: x,
                    j: k
                });
                var cell = gBoard[x][k]
                cell.isShown = true
                renderBoard(gBoard)


            }
            console.log(shownCells);
        }
        setTimeout(function () {
            for (var x = i - 1; x <= i + 1; x++) {
                if (x < 0 || x >= gBoard.length) continue;
                for (var k = j - 1; k <= j + 1; k++) {
                    if (k < 0 || k >= gBoard.length) continue;
                    if (k === j && x === i) continue;
                    if (gBoard[i][j].isMine) checkGameOver(false)
                    var cell = gBoard[x][k]
                    cell.isShown = false
                    for (var index = 0; index < shownCells.length; index++) {
                        gBoard[shownCells[index].i][shownCells[index].j].isShown = true
                    }
                    renderBoard(gBoard)
                    gHintIsOn = false
                }
            }

        }, 1000);
        win()
    }
}



function cellMarked(i, j) {
    var cell = gBoard[i][j]
    cell.isMarked ? cell.isMarked = false : cell.isMarked = true
    gGame.markedCount++
    renderBoard(gBoard)
    win()

}

function startTime() {
    if (gGame.showncount === 0) {
        gGame.secsPassed = 0;
        gIntervalGame = setInterval(setTime, 1000)
    }
    return
}

var elH2 = document.querySelector('h2')



function win() {
    if (gCurrentSize ** 2 - gGame.markedCount === gGame.showncount) checkGameOver(true)
}


// function updateHighScore() {
//     localStorage.setItem('highScore', gBoard.secsPassed) 

//     if (GAMESCOUNT === 0) {
//         var finishedGameScore = gBoard.secsPassed;
//         return finishedGameScore
//     } 
//     if (gBoard.secsPassed < localStorage.getItem('highScore'))  return gBoard.secsPassed

//     }


    function checkGameOver(isWin) {


        if (isWin) {
            elH2.innerText = 'You Won!!'
            elH2.style.display = 'block'
            elSmiley.src = "win.gif"
            sound.play()
            // console.log(updateHighScore())
        } else {
            elH2.innerText = "BOOM! You Lost!!"
            elH2.style.display = 'block'
            elSmiley.src = "lose.gif"


        }
        clearInterval(gIntervalGame)
        document.querySelector('.restart-notification').style.display = 'block'
        gGame.isOn = false

    }



    function restart() {
        clearInterval(gIntervalGame)
        gHintIsOn = false
        document.querySelector('.hint1').style.display = 'inline'
        document.querySelector('.hint2').style.display = 'inline'
        document.querySelector('.hint3').style.display = 'inline'
        gGame.showncount = 0
        gGame.markedCount = 0
        elH2.innerText = ""
        initGame(gCurrentSize)

    }


    //TIMER:


    var minutesLabel = document.getElementById("minutes");
    var secondsLabel = document.getElementById("seconds");

  

    function setTime() {
        ++gGame.secsPassed;
        secondsLabel.innerHTML = pad(gGame.secsPassed % 60);
        minutesLabel.innerHTML = pad(parseInt(gGame.secsPassed / 60));
    }

    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }