
const game = (()=> {
    let hasAWinner = false;
    let players;
    let turn = 0;
    const winConditions = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    const body = document.querySelector("body");

    const gameBoard = (()=> {
        const board = ["", "", "", "", "", "", "", "", ""];
        const updateBoard = (index, type) => board[index] = type;
        const getBoard = () => board;
        return {updateBoard, getBoard};
    })();
        
    const player = (playerName = "Player", option, bot)=> {
        const name = playerName;
        const type = option;
        const isABot = bot;
        let count = 0;
        return {name, type, count, isABot};
    }

    const getOption = (option, startBtn, options)=> {
        const div = Array.from(options).filter(div=> {
            div.style.backgroundColor = "#283D3B";
            if(div.id == option){
                return div;
            }
        })[0];
        startBtn.style.display = "flex";
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

            players = [player_1, player_2];
        }
        div.style.backgroundColor = "#1d4e89";
    }

    const isTie = ()=> {
        const board = gameBoard.getBoard();
        let count = 0;
        board.forEach(field=> {
            if(field != ""){
                count++;
            }
        });
        return (count == board.length)?true:false;
    }

    const isgameOver = (player)=> {
        const board = gameBoard.getBoard();
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 3; j++){
                let index = winConditions[i][j];
                if(board[index] == player.type){
                    player.count++;
                }
            }
            if(player.count == 3) return true;
            player.count = 0;
        }
        return false;
    }

    const render = ()=> {
        gameBoard.getBoard().forEach(place => {
            const para = document.createElement("p");
            para.textContent = place;
            body.appendChild(para);
        })
    }
    
    const movement = (div, text)=> {
        if(hasAWinner) return;
        const tiles = Array.from(document.querySelectorAll(".tile"));
        const index = tiles.indexOf(div);
        if(gameBoard.getBoard()[index] == ""){
            gameBoard.updateBoard(index, players[turn].type);
            div.textContent = players[turn].type;
            hasAWinner = isgameOver(players[turn]);
            (!turn)? turn++: turn--;
        }
        text.textContent = `It's Player ${turn+1} turn.`;
        if(isTie()){
            document.querySelector(".text").textContent = "It's a Tie!";
        }
    }

    const start = (container, startBtn)=> {
        const text = document.querySelector(".text");
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
        text.textContent = `It's Player ${turn+1} turn.`;
    }

    const menuEvents = ()=> {
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

    return {menuEvents};
})();

 game.menuEvents();