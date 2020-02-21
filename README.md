# Grid
A JavaScript grid arrays constructor

## Install
` $ npm install lilylaw/grid `

## usage
```
const Grid = require('@lilylaw/grid');

const myGrid = new Grid(9, 9);
const sudokuSizedBlocks = myGrid.blocks(3);

function checkIf9x9TicTacToeGameIsWon() {
    const checkFor9OfTheSame = arr => arr.find(line => line.length >= 9 && line.every(cell => cell === line[0]));
    const diagonalWin = checkFor9OfTheSame(myGrid.diagonals());
    const horizontalWin = checkFor9OfTheSame(myGrid.rows());
    const verticalWin = checkFor9OfTheSame(myGrid.columns());
    return diagonalWin || horizontalWin || verticalWin
}
```
## API
* rows(): returns grid as an array with each item as row array (linear)
* columns(): returns grid as an array formated vertically into column arrays
* diagonals(): returns grid as arrays formated diagonally. the first array [0] are all the diagonal forward lines (/) and the second [1] are backward lines (\\)
* blocks(width: Int, height: Int/optional): returns grid as an array formated into arrays of the speciefied block size 
* nths(n: Int, from: Array/optional, starting: Int/optional)
* merge(withArr: Array, options: {replaceIfBigger: false, replaceIfSmaller: false, insertWhereEmpty: true, replaceAll: false}/optional): merges an array into to grid and then returns updated grid
* flattenArray(arr: Array/optional) returns grid or speciefied arr as a flat one diamention array
* getIndex(x: Int, y: Int): converts two part coordinate into single index returns Int
* getCoordinate(index: Int): converts single index into two part coordinate return Object {x, y}