
/************
 ** Global Variables
 ************/
var currentPlayerSymbol = "x";
var tellFirebase = new GenericFBModel('local',updateGameBoard);
var gameCellArray = [];
var sliderValue;
var width; //= 5;
var victory = false;
var userSelectedWinCondition;
var player = {
	currentPlayerSymbol: "x",
	x: {
		// name: input,
		img: 'assets/images/rebel.jpg',
		wins: 0
	},
	o: {
		// name: input,
		img: 'assets/images/empire.jpg',
		wins: 0
	}
};

var firebaseObject = {
    gameState: gameCellArray,
    currentPlayer: player.currentPlayerSymbol
};

/************
 ** DOM Creation
 ************/
$(document).ready(initialize);
function initialize(){
    //setSliderValue();
    createCells(width);
    applyHandlers();
    createArrayOfCells(width);
    updatePlayerIndicator();
    $('.tlt').textillate();

}
function createCells(width){
	for (var i = 0; i < width; i++){
		for (var j = 0; j < width; j++){
		$('#gamebody').append('<div class="tttCell tttCell' + width + '" row=' + i +' col=' + j + '><img src=""></div>');
		}
	}
}
function createArrayOfCells(width){
	for(var i = 0; i < width; i++) {
		gameCellArray.push([]);
		for(var j = 0; j < width; j++) {
			gameCellArray[i].push(0);
		}
	}
}
function applyHandlers(){
    $('#gamebody').on('click','div',cellClicked);
    //more handlers go here.  next round button?  play again button?
    // $(".gameBoardSizeSlider").on("change", function() {
    //     width = parseInt($(".gameBoardSizeSlider").val());
    //     console.log("Slider functionality works");
    //     createCells(width);
    //     createArrayOfCells(width);

    $(".gameBoardSizeConfirm").on("click",setSliderValue);
    $(".resetGameButton").on("click",resetGame);
    $("#userSelectedWinCondition3").on("click", function() {
        console.log("User selected win condition was clicked");
        userSelectedWinCondition = parseInt($("#userSelectedWinCondition3").val());
        return userSelectedWinCondition;
    });
    $("#userSelectedWinCondition5").on("click", function() {
        console.log("User selected win condition was clicked");
        userSelectedWinCondition = parseInt($("#userSelectedWinCondition5").val());
        return userSelectedWinCondition;
    });
}
function setSliderValue(){
    sliderValue= parseInt($(".gameBoardSizeSlider").val());
    width = sliderValue;
    initialize();
    return width;
}
/************
 ** Functions
 ************/
function cellClicked(){
    if ($(this).hasClass('clicked')){
        return;
    }
    var row = $(this).attr('row');
    var col = $(this).attr('col');
    gameCellArray[row][col] = player.currentPlayerSymbol;
    updateGameBoard("turn this on when you want to test locally"); //local version
    // tellFirebase.saveState(firebaseObject); //firebase version
    checkWin(row, col);
    swapPlayerSymbol();
}
function updateGameBoard(data){
    for (var i=0; i < width;i++) {
        for (var j=0; j < width; j++) {
            var valueOfCell = gameCellArray[i][j]; //local version
            // var valueOfCell = data.gameState; //firebase version
            if (valueOfCell > '1') {
                $('#gamebody > div[row=' + i + '][col=' + j + ']').addClass('clicked player' + valueOfCell).children('img').attr( "src", player[valueOfCell].img );
            }
        }
    }
    console.log("cells updated");
}
function checkWin(row, col){
	checkHorizontal(row);
    if (!victory) {
		checkVertical(col);
    }
    if (!victory){
    	checkDiagonal1(row,col);
    }
    if (!victory){
    	checkDiagonal2(row,col);
    }
}
function findCurrentSymbol(value) {
    return value === player.currentPlayerSymbol;
}
function checkHorizontal(row){
    var currentRow = gameCellArray[row].slice(0);
	var foundSymbols = currentRow.filter(findCurrentSymbol);
    if (foundSymbols.length === userSelectedWinCondition){
        playerWins("row "+row);
	}
}
function checkVertical(col){
	var currentColumn = [];
	for (var i=0;i < width; i++){
		var value = gameCellArray[i][col];
        currentColumn.push(value);
	}
    var foundSymbols = currentColumn.filter(findCurrentSymbol);
    if (foundSymbols.length === userSelectedWinCondition){
        playerWins("col "+col);
    }
}
function checkDiagonal1(row,col){
	// if(row !== col){
		//return;
    // }
    var diagonal1 = [];

    if (userSelectedWinCondition === 5) {
        for (var i =0; i < width; i++) {
            if (gameCellArray[i][i] == player.currentPlayerSymbol) {
                diagonal1.push(gameCellArray[i][i]);
                console.log(diagonal1);
            }
        }
        if (diagonal1.length !== undefined && diagonal1.length === userSelectedWinCondition) {
            playerWins("\\ diagonal");

        }
        else {
            console.log("Not a winner");
        }
    }
    else {

        for (var i = 0; i < width - 1; i++) {
            if (gameCellArray[i][i] == player.currentPlayerSymbol) {
                diagonal1.push(gameCellArray[i][i]);
                console.log(diagonal1);
                /*if (userSelectedWinCondition === 5 && gameCellArray[4][4] == player.currentPlayerSymbol) {
                 diagonal1.push(gameCellArray[4][4])
                 console.log(diagonal1);
                 }*/

            }

            else if ( (gameCellArray[i][i+1] !== 0 && gameCellArray[i][i+1] == player.currentPlayerSymbol) || (gameCellArray[i+1][i] !== 0 && gameCellArray[i+1][i]) ) {
                diagonal1.push(gameCellArray[i][i+1]);
                console.log(diagonal1);
            }
        }
        if (diagonal1.length !== undefined && diagonal1.length === userSelectedWinCondition) {
            playerWins("\\ diagonal");

        }
        else {
            console.log("Not a winner");
        }
    }
}
function checkDiagonal2(row,col){
	if (parseInt(row)+parseInt(col) !== width-1){
		return;
    }
    else {
        var diagonal2 = [];
        for (var i = 0; i < width; i++) {
            var value = gameCellArray[(width-1)-i][i];
            diagonal2.push(value);
        }
        var foundSymbols = diagonal2.filter(findCurrentSymbol);
        if (foundSymbols.length === userSelectedWinCondition) {
            playerWins("/ diagonal");
        }
    }
    console.log("Test");
}
function playerWins(winCondition){
	victory = true;
	player[currentPlayerSymbol].wins++;
	console.log("***** " + currentPlayerSymbol + " wins on " + winCondition)
}
function swapPlayerSymbol(){
	player.currentPlayerSymbol == 'x' ? player.currentPlayerSymbol = 'o' : player.currentPlayerSymbol = 'x';
	updatePlayerIndicator();
}
function updatePlayerIndicator(){
	if (player.currentPlayerSymbol === 'x'){
		$('#player1').addClass('activePlayer');
		$('#player2').removeClass('activePlayer');
	} else {
		$('#player1').removeClass('activePlayer');
        $('#player2').addClass('activePlayer');
	}
}

function resetGame() {
    console.log("Reset?");
    $("#gamebody > div").remove();
}