# Grid

A JavaScript grid constructor. Access arrays using grid constructs: rows, columns, blocks, diagonals;

## Install

`$ npm install @lilylaw/grid`

## API
### Constructor
`new Grid({columns: int, rows: int, blockSize: {width: int, height: int(optional)}, wrapReturnedValuesWithGridData: boolean(optional)})`

- columns: the grid width
- rows: the grid height
- blockSize: size blocks should be split into (i.e. a sudoku grid would be a 3 by 3 blockSize)
    - width
    - height
- wrapReturnedValuesWithGridData 
    - if set to true (default) each returned cell/array item will be an object:
        - value: user defined (settable)
        - column
        - row
        - index
        - block
    - if set to false each returned cell/array item will be the value (not settable directly)

### Adding/editing values 
```
const myGrid = new Grid({columns: 4, blockSize: {width: 4}, wrapReturnedValuesWithGridData: false});
myGrid.cells = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]; // or
myGrid.rows = [[0,1,2,3],[4,5,6,7],[7,9,10,11],[12,13,14,15]]; // or
myGrid.columns = [[0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15]] // or 
myGrid.blocks = [[0,1,4,5],[2,3,6,7],[8,9,12,13],[10,11,14,15]]
```
The numbers are just for example, you can use any JS value. The grid initialises with it's index as values so with or without the assignments above the grid will look like:
```
   0   1   2   3

   4   5   6   7

   8   9   10  11

   12  13  14  15
```
Update cells using:
```
myGrid.updateCells([
    {index: 3, value: {message: 'updated via index'}}, 
    {column: 3, row: 1, {message: 'updated via column and row'}}, 
    {block: 4, blockIndex: 1, value: {message: 'updated via block and block scoped index'}}, 
    {block: 4, blockColumn: 1, blockRow: 1, value: {message: 'updated via block and block scoped column and row'}},
]); /* resulting grid:
   0   1   2   {message: 'updated via index'}

   4   5   6   {message: 'updated via column and row'}

   8   9   10  {message: 'updated via block and block scoped index'}

   12  13  14  {message: 'updated via block and block scoped column and row'}
*/
```
If wrapReturnedValuesWithGridData is not set to false you can also update cells via:
```
myGrid = new Grid({columns: 4, blockSize: {width: 4}, wrapReturnedValuesWithGridData: true})
myGrid.cells[0].value = 'my update';
myGrid.rows[0][0].value = ['my','second','update'];
myGrid.columns[0][0].value = {message: 'my third update'}
myGrid.blocks[0][0].value = 'my fourth update';
```
### Getting values
```
myGrid.cells; // [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
myGrid.rows; // [[0,1,2,3],[4,5,6,7],[7,9,10,11],[12,13,14,15]]
myGrid.columns; // [[0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15]]
myGrid.blocks; // [[0,1,4,5],[2,3,6,7],[8,9,12,13],[10,11,14,15]]
myGrid.diagonals.forward // [[0],[1,4],[2,5,8],[3,6,9,12],[7,10,13],[11,14],[15]]
myGrid.diagonals.backward: [[3],[2,7],[1,6,11],[0,5,10,15],[4,9,14],[8,13],[12]]
myGrid.getNths(3) // [0, 3, 6, 9, 12, 15]
myGrid.getNths(3, 1 /*start*/) // [1, 4, 7, 10, 13]
```
### List
- `cells`: returns a flat array and can be set with a flat array, reinitialing the grid
- `rows`: returns array of row arrays and can be set an array of row arrays, reinitialing the grid
- `columns`: returns array of column arrays and can be set with an array of column arrays, reinitialing the grid
- `blocks`: returns array of block arrays (sized at Grid initialisation with blockSize) and can be set with an array of block arrays, reinitialing the grid
- `diagonals`: returns diagonals object: forward as in forward lines / starting from index 0 and backward (\\) starting from the end of row 0
- `getNths(n: int, starting: int(optional))`: returns a flat array 

## What's new in V2

- Grid is stored as array of Cells (with position info and values) as opposed to rows in V1
- Rows, columns, and blocks now work by reading from a stored lookup table. They no longer need to be called as a method. They can be get or set via property name

## TODOs for later release
- Currently adding values by set methods reinitialises the grid, meaning the lookup tables get repopulated each time. V2.1 should implement some performance testing and optimise accordingly
- diagonals is unfinished, it should have a lookup table and a setter
- Setters should have checks to test how the input arguments shape matches with the current grid. Then it can either work out an update for the grid width, height, blockSize or output a warning