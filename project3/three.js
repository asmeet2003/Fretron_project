
const readline = require('readline');

 function createBoard(soldiersCoords, boardSize = 10) {
    const board = Array.from({ length: boardSize }, () => Array(boardSize).fill('.'));
    soldiersCoords.forEach(([x, y]) => {
        board[x][y] = 'S';
    });
    return board;
}

 function isValidMove(x, y, boardSize) {
    return 0 <= x && x < boardSize && 0 <= y && y < boardSize;
}

 function moveCastle(x, y, direction, board) {
    const directions = {
        'right': [0, 1],
        'down': [1, 0],
        'left': [0, -1],
        'up': [-1, 0]
    };
    const [dx, dy] = directions[direction];
    let nx = x, ny = y;

    while (isValidMove(nx + dx, ny + dy, board.length)) {
        nx += dx;
        ny += dy;
        if (board[nx][ny] === 'S') {
            return [nx, ny];
        }
    }
    return null;
}

 function dfs(x, y, startX, startY, board, path, allPaths, direction) {
    if (x === startX && y === startY && !board.flat().includes('S')) {
        allPaths.push([...path]);
        return;
    }

    const newDirection = {
        'right': 'down',
        'down': 'left',
        'left': 'up',
        'up': 'right'
    };

    let currentDirection = direction;
    for (let i = 0; i < 4; i++) {
        const newPos = moveCastle(x, y, currentDirection, board);
        if (newPos) {
            const [nx, ny] = newPos;
             path.push(`Kill (${nx},${ny}). Turn ${newDirection[currentDirection]}`);
             board[nx][ny] = '.'; 

            dfs(nx, ny, startX, startY, board, path, allPaths, newDirection[currentDirection]);

            
            path.pop();
            board[nx][ny] = 'S';
        }
        currentDirection = newDirection[currentDirection];
    }
}


async function getUserInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function question(query) {
        return new Promise(resolve => rl.question(query, resolve));
    }

    const boardSize = 10;
    const soldiersCoords = new Set();

    let numSoldiers;
    while (true) {
        try {
            numSoldiers = parseInt(await question("Enter the number of soldiers:\n"));
            if (isNaN(numSoldiers) || numSoldiers <= 0) throw new Error("Number of soldiers must be a positive integer.");
            break;
        } catch (e) {
            console.log(`Invalid input: ${e.message}. Please enter a valid number.`);
        }
    }

    for (let i = 0; i < numSoldiers; i++) {
        while (true) {
            try {
                const coords = (await question(`Enter coordinates for soldier ${i + 1} (format: x,y):\n`)).split(',').map(Number);
                if (coords.length !== 2 || coords.some(isNaN)) throw new Error("Input must be in the format x,y.");
                const [x, y] = coords;
                if (!(0 <= x && x < boardSize && 0 <= y && y < boardSize)) throw new Error("Coordinates must be within the board limits.");
                soldiersCoords.add([x, y].toString());
                break;
            } catch (e) {
                console.log(`Invalid input: ${e.message}. Please enter valid coordinates in the format x,y.`);
            }
        }
    }

    let startPos;
while (true) {
    try {
        const coords = (await question("Enter the coordinates for your 'special' castle (format: x,y):\n")).split(',').map(Number);
        if (coords.length !== 2 || coords.some(isNaN)) throw new Error("Input must be in the format x,y.");
        const [startX, startY] = coords;
        if (!(0 <= startX && startX < boardSize && 0 <= startY && startY < boardSize)) throw new Error("Coordinates must be within the board limits.");
        startPos = [startX, startY];
        break;
    } catch (e) {
        console.log(`Invalid input: ${e.message}. Please enter valid coordinates in the format x,y.`);
    }
}

rl.close();
return { soldiersCoords: Array.from(soldiersCoords), startPos, boardSize };
}
 
(async () => {
    const { soldiersCoords, startPos, boardSize } = await getUserInput();

 
    const board = createBoard(soldiersCoords, boardSize);
    const [x, y] = startPos;
    const allPaths = [];

    
    dfs(x, y, x, y, board, [], allPaths, 'right');  // Start moving 'right' initially

    console.log(`Thanks. There are ${allPaths.length} unique paths for your 'special_castle'\n`);

    allPaths.forEach((path, i) => {
        console.log(`Path ${i + 1}\n=======`);
        console.log(`Start (${startPos[0]},${startPos[1]})`);
        path.forEach(step => console.log(step));
        console.log(`Arrive (${startPos[0]},${startPos[1]})\n`);
    });
})();
