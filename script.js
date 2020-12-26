
const game = (()=> {
    let hasAWinner = false;
    let players;
    let turn = 0;
    let gameType;
    const winConditions = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

    const gameBoard = (()=> {
        const board = ["", "", "", "", "", "", "", "", ""];
        const updateBoard = (index, type) => board[index] = type;
        const getBoard = () => board;
        const resetBoard = ()=>{
            for(let i = 0; i < board.length; i++){
                board[i] = "";
            }
        }
        return {updateBoard, getBoard, resetBoard};
    })();
        
    const player = (option, bot)=> {
        let name = "Player";
        const type = option;
        const isABot = bot;
        const getPlayerName = ()=> name;
        const setPlayerName = (PlayerName)=> name = PlayerName; 
        let count = 0;
        return {type, count, isABot, getPlayerName, setPlayerName};
    }

    const getOption = (option, startBtn, options)=> {
        const div = Array.from(options).filter(div=> {
            div.style.backgroundColor = "#283D3B";
            if(div.id == option){
                return div;
            }
        })[0];
        startBtn.style.display = "flex";
        gameType = option;
        if(option == "players"){
            document.querySelector("form").style.display = "flex";
            options.forEach(div=> div.style.display = "none");
            const player_1 = player("X", false);
            const player_2 = player("O", false);

            players = [player_1, player_2];
        }
        else{
            const player_1 = player("X", false);
            const player_2 = player("O", true);
            player_2.setPlayerName("Computer");

            players = [player_1, player_2];
        }
        div.style.backgroundColor = "#1d4e89";
    }

    const isTie = (board = gameBoard.getBoard())=> {
        let count = 0;
        board.forEach(field=> {
            if(field != ""){
                count++;
            }
        });
        return (count == board.length)?true:false;
    }

    const displayResult = (res)=> {
        const restartBtn = document.querySelector("#start");
        restartBtn.textContent = "Play Again";
        restartBtn.style.display = "flex";
        const result = document.querySelector("#result");
        result.style.display = "flex";
        gameType = "reset";
        if(res == "tie"){
            result.firstElementChild.textContent = "It's a Tie!";
        }
        else {
            result.firstElementChild.textContent = `${players[turn].getPlayerName()} won!`;
        }
    }

    const isgameOver = (player, board = gameBoard.getBoard())=> {
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 3; j++){
                let index = winConditions[i][j];
                if(board[index] == player.type){
                    player.count++;
                }
            }
            if(player.count == 3) {
                return true;
            }
            player.count = 0;
        }
        return false;
    }

    const resetGame = (container)=> {
        const tiles = document.querySelectorAll(".tile");
        const result = document.querySelector("#result");
        turn = 0;
        players.forEach(player=> player.count = 0);
        gameBoard.resetBoard();
        hasAWinner = false;
        // remove resultDiv;
        result.style.display = "none";
        result.firstElementChild.textContent = "";
        // reset Container
        document.querySelector(".text").textContent = "";
        tiles.forEach(tile=> container.removeChild(tile));
    }
    
    const score = {
        X:  -1,
        O:   1,
        tie: 0
    }

    const miniMax = (board, depth, isMaximizing, player)=> {
        let result = null;
        if(isTie(board)){
            result = "tie";
        }
        if(isgameOver(player, board)){
            result = player.type;
            player.count = 0;
        }
        if(result != null){
            return score[result];
        }
        if(isMaximizing){
            let bestScore = -Infinity;
            for(let i = 0; i < board.length; i++){
                if(board[i] == ""){
                    board[i] = players[1].type;
                    let score = miniMax(board, depth + 1, false, players[0]);
                    board[i] = "";
                    if(bestScore < score){
                        bestScore = score;
                    }
                }
            }
            return bestScore;
        }
        else {
            let bestScore = Infinity;
            for(let i = 0; i < board.length; i++){
                if(board[i] == ""){
                    board[i] = players[0].type;
                    let score = miniMax(board, depth + 1, true, players[1]); 
                    board[i] = "";
                    if(bestScore > score){
                        bestScore = score;
                    }
                }
            }
            return bestScore;
        }
    }

    const computerMove = ()=> {
/*         let index;
        do{
            index = Math.floor(Math.random() * 9);
        }while(gameBoard.getBoard()[index] != "");
        gameBoard.updateBoard(index, players[turn].type); */
        let bestScore = -Infinity;
        const board = [...gameBoard.getBoard()];
        let index;
        for(let i = 0; i < board.length; i++){
            if(board[i] == ""){
                board[i] = players[1].type;
                let score = miniMax(board, 0, false, players[0]);
                board[i] = "";
                if(score > bestScore){
                    bestScore = score;
                    index = i;
                }
            }
        }
        gameBoard.updateBoard(index, players[turn].type);
        if(isgameOver(players[1])){
            displayResult("computer");
        }
        return index;
    }

    const movement = (div, text)=> {
        if(hasAWinner) return;
        const tiles = Array.from(document.querySelectorAll(".tile"));
        const index = tiles.indexOf(div);
        if(gameBoard.getBoard()[index] == ""){
            gameBoard.updateBoard(index, players[turn].type);
            div.textContent = players[turn].type;
            hasAWinner = isgameOver(players[turn]);
            if(hasAWinner){
                displayResult("player");
            }
            (!turn)? turn++: turn--;
        }
        if(isTie() && !hasAWinner){
            displayResult("tie");
        }
        if(players[turn].isABot && !hasAWinner){
            tiles[computerMove()].textContent = players[turn].type;
            hasAWinner = isgameOver(players[turn]);
            turn = 0;
        }
        text.textContent = `It's ${players[turn].getPlayerName()} turn.`;
    }

    const isValidName = ()=> {
        const inputs = document.querySelectorAll("input");
        let count = 0;
        inputs.forEach(input=> {
            const span = input.parentNode.firstElementChild;
            if(/^[a-zA-Z][\d\D]{0,49}/.test(input.value)){
                span.textContent = "";
                count++;
            }
            else{
                span.textContent = "First character has to be a letter and max size is 50";
                span.style.display = "inline";
            }
        })
        if(gameType != "players"){
            return true;
        }
        if(count == 2){
            players[0].setPlayerName(inputs[0].value);
            players[1].setPlayerName(inputs[1].value);
            document.querySelector('form').style.display = "none";
            return true;
        }
        else {
            return false;
        }
    }

    const start = (container, startBtn)=> {
        resetGame(container);
        const text = document.querySelector(".text");
        if(isValidName()){
            startBtn.style.display = "none";
            Array.from(container.children).forEach(tag => {
                if(tag.nodeName == "DIV"){
                    tag.style.display = "none";
                }
                else{
                    tag.textContent = "";
                }
            });
            container.classList.add("grid");
            for(let i = 0; i < 9; i++){
                const div = document.createElement("div");
                if(i % 3 != 2){
                    div.classList.add("rightBord");
                }
                if(i < 6){
                    div.classList.add("bottomBord");
                }
                div.classList.add("tile");
                div.addEventListener("click", movement.bind(null, div, text));
                container.appendChild(div);
            }
            text.textContent = `It's ${players[turn].getPlayerName()} turn.`;
        }
    }

    const init = ()=> {
        // ====== Start Game Event ====== //
        const container = document.querySelector(".container");
        const startBtn = document.querySelector("#start");
        startBtn.addEventListener("click", start.bind(null, container, startBtn));

        // ====== Two Players or AI Event ====== //
        const option = Array.from(container.children).filter(content=> {
            if(content.nodeName == "DIV"){
                return content;
            }
        });

        option.forEach(div=> {
            div.addEventListener("click", getOption.bind(null, div.id, startBtn, option));
        });
    }

    return {init};
})();

 game.init();