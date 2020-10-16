import Cell from './Cell';
import isActual from '@lilylaw/isactual';

type PositionTypes = 'index' | 'row' | 'column' | 'block';
type Position = {
  [P in PositionTypes]: number
}
type CellLocationTypes = PositionTypes | 'blockIndex' | 'blockColumn' | 'blockRow';
type CellLocation = {
  [L in CellLocationTypes]?: number;
}
interface CellData {
  data: any;
}
type Cell = Position & CellData;

interface BlockSize {
  width: number;
  height: number;
}

type LookupType = 'row' | 'column' | 'block';
interface LookupTable {
  [propName: number]: number[];
}
interface Lookup {
  [propName: string]: LookupTable;
  row: LookupTable;
  column: LookupTable;
  block: LookupTable;
}

interface Grid {
  height: number;
  width: number;
  blockSize: BlockSize;
  lookup: Lookup;
  grid: Cell[];
  initGrid: (arr: any[]) => void;
  getRows: () => any[];
  getColumns: () => any[];
  getBlocks: () => any[];
  getDiagonals: () => any[];
  getNths: (n: number, starting?: number) => any[];
  updateCells: (arr: (CellLocation & CellData)[]) => CellData[];
  translate: ({index, row, column}: {index?: number; row?: number; column?: number}) => Position;
  translateIndex: (cellLocation: CellLocation, width?: number) => number;
  translateCoordinate: ({index}: CellLocation) => CellLocation;
  translateBlock: ({column, row}: CellLocation) => number;
  translateBlockIndex: ({blockColumn, blockRow}: CellLocation) => number;
  getDataUsingLookup: (as: LookupType) => any[];
  addToLookup: (position: Position) => void;
}

class Grid {
  constructor({columns, rows, blockSize, defaultValue}: {columns?: number; rows?: number; blockSize: {width: number; height?: number}; defaultValue?: any}) {
    this.height = rows || columns || 3;
    this.width = columns || this.height;
    this.blockSize = {width: blockSize.width, height: blockSize.height || blockSize.width};
    this.lookup = {
      row: {},
      column: {},
      block: {},
    };
    this.grid = [];
    this.initGrid(new Array(this.height * this.width).fill({}).map((cell, index) => (defaultValue !== undefined ? defaultValue : index)));
  }
  get cells() {
    return this.grid.map((cell: Cell) => cell.data);
  }
  set cells(arr) {
    if (!Array.isArray(arr)) {
      throw Error(`Cannot set cells to be of type ${typeof arr}, must be an array!`);
    }
    this.initGrid(arr);
  }
  get rows() {
    return this.getRows();
  }
  set rows(arr) {
    const flatArray = Array.isArray(arr) && arr.flat();
    if (!flatArray) {
      throw Error(`Cannot set rows with ${arr}`);
    }
    this.initGrid(flatArray);
  }
  get columns() {
    return this.getColumns();
  }
  set columns(arr) {
    if (!Array.isArray(arr)) {
      throw Error(`Cannot set columns with ${arr}`);
    }
    const flatArray = arr.flat().fill(null);
    arr.forEach((col, column) =>
      col.forEach((data: any, row: number) => {
        const newIndex = this.translateIndex({column, row});
        flatArray[newIndex] = data;
      })
    );
    this.initGrid(flatArray);
  }
  get blocks() {
    return this.getBlocks();
  }
  set blocks(arr) {
    if (!Array.isArray(arr)) {
      throw Error(`Cannot set blocks with ${arr}`);
    }
    const tempRows: number[][] = [];
    let blockCount = 0;
    for (let block of arr) {
      for (let i=0;i<this.blockSize.height;i++) {
        const start = i*(this.blockSize.width);
        const end = start + this.blockSize.width;
        const segment = block.slice(start, end);
        const rowIndex = i + (Math.floor(blockCount / this.blockSize.width) * this.blockSize.width);
        Array.isArray(tempRows[rowIndex]) ? tempRows[rowIndex].push(...segment) : tempRows[rowIndex] = segment;
      }
      blockCount++;
    }
    const flatArray = tempRows.flat();
    this.initGrid(flatArray);
  }
  get diagonals() {
    return this.getDiagonals();
  }
}
Grid.prototype.initGrid = function (arr: any[]) {
  this.lookup = {
    row: {},
    column: {},
    block: {},
  };
  this.grid = arr.map(
    (data: any, index: number): Cell => {
      const position = this.translate({index});
      this.addToLookup(position);
      return new (Cell as any)({position, data});
    }
  );
};
Grid.prototype.addToLookup = function (position) {
  const addEntry = ({type, index}: {type: PositionTypes; index: number}) => {
    const location = position[type]
    const lookupTable = this.lookup[type];
    if (lookupTable) {
      if (Array.isArray(lookupTable[location])) {
        lookupTable[location].push(index)
      } else { 
        lookupTable[location] = [index]; 
      }
    }
  }
  (Object.keys(position) as PositionTypes[]).forEach((type) => addEntry({type, index: position.index}));
};
Grid.prototype.translate = function ({index, row, column}) {
  if (index === undefined && (!row || !column)) {
    throw Error('Grid.prototype.translate requires an index or row and column!');
  }
  let block;
  if (isActual.number(index)) {
    const coordinates = this.translateCoordinate({index});
    row = coordinates.row;
    column = coordinates.column;
  } else {
    index = this.translateIndex({column, row});
  }
  block = this.translateBlock({column, row});
  if ([row, column, block, index].some(output => isActual.number(output))) {
    return ({
      row,
      column,
      block,
      index
    } as Position);
  }
  else {
    throw Error(`Grid.prototype.translate failed to produce a complete position. Output: row: ${row}, column: ${column}, block: ${block}, index: ${index}`);
  }
};
Grid.prototype.translateIndex = function translateIndex(this: Grid, cellLocation, width = this.width) {
  const {index, column, row, block, blockIndex, blockRow, blockColumn} = cellLocation;
  let cellIndex;
  if (isActual.number(cellLocation.index)) {
    cellIndex = index;
  } else if ((isActual.number(column)) && (isActual.number(row))) {
    cellIndex = (column as number) + (row as number) * width;
  } else if (isActual.number(block)) {
    if (isActual.number(blockIndex)) {
      cellIndex = (block as number) * (this.blockSize.width * this.blockSize.height) + (blockIndex as number);
    } else if ((isActual.number(blockRow)) && (isActual.number(blockColumn))) {
      const blockIndex = this.translateIndex({row: blockRow, column: blockColumn}, this.blockSize.width);
      cellIndex = this.translateIndex({block, blockIndex});
    }
  }
  if (!(isActual.number(cellIndex))) {
    throw Error(`Grid.prototype.translateIndex failed to produce an index. Input arguments: cellLocation: ${cellLocation} width: ${width}`)
  }
  return (cellIndex as number)
};
Grid.prototype.translateCoordinate = function translateCoordinate({index}) {
  if (isActual.number(index)) {
    return {column: (index as number) % this.width, row: Math.floor((index as number) / this.width)};
  }
  else {
    throw Error(`Grid.prototype.translateCoordinate failed to produce a coordinate. Input argument: index: ${index}`);
  }
};
Grid.prototype.translateBlock = function ({column, row}) {
  if (isActual.number(column) && isActual.number(row)) {
    const blockCol = Math.floor((column as number) / this.blockSize.width);
    const blockRow = Math.floor((row as number) / this.blockSize.height);
    return blockCol + blockRow * this.blockSize.height;
  }
  else {
    throw Error(`Grid.prototype.translateBlock requires both column and row arguments to be a number. Input arguments: row: ${row}, column: ${column}`);
  }
  
};
Grid.prototype.translateBlockIndex = function ({blockColumn, blockRow}) {
  if (isActual.number(blockColumn) && isActual.number(blockRow)) {
    return this.blockSize.width * (blockRow as number) + (blockColumn as number);
  }
  else {
    throw Error(`Grid.prototype.translateBlockIndex requires both blockColumn and blockRow arguments to be a number. Input arguments: blockColumn: ${blockColumn}, blockRow: ${blockRow}`);
  }
};
Grid.prototype.getDataUsingLookup = function (as) {
  const output = Object.keys(this.lookup[as])
    .sort()
    .map((asIndex) => this.lookup[as][parseInt(asIndex)].map((cellIndex: number) => this.grid[cellIndex].data));
  return output;
};
Grid.prototype.getRows = function () {
  return this.getDataUsingLookup('row');
};
Grid.prototype.getColumns = function () {
  return this.getDataUsingLookup('column');
};
Grid.prototype.getDiagonals = function () {
  const forwardSlashes = [];
  const backSlashes = [];
  let yShift = 0;
  let xShift = 0;
  let x = 0;
  let y = 0;
  const grid = this.rows;
  while (xShift < this.width - 1 || yShift < this.height) {
    const forwardSlash = [];
    const backSlash = [];
    do {
      backSlash.push(grid[y][this.width - 1 - x]);
      forwardSlash.push(grid[y++][x--]);
    } while (x >= 0 && y < this.height);
    forwardSlashes.push(forwardSlash);
    backSlashes.push(backSlash);
    if (xShift + 1 < this.width) {
      x = ++xShift;
      y = yShift;
    } else {
      y = ++yShift;
      x = xShift;
    }
  }
  return [forwardSlashes, backSlashes];
};
Grid.prototype.getBlocks = function () {
  return this.getDataUsingLookup('block');
};
Grid.prototype.getNths = function (n: number, starting = 0) {
  return this.grid
    .slice(starting)
    .filter((v: Cell, i: number) => i % n === 0)
    .map((cell: Cell) => cell.data);
};
Grid.prototype.updateCells = function updateCells(arr) {
  arr.forEach(({index, column, row, block, blockIndex, blockRow, blockColumn, data}) => {
    let cellIndex;
    if (isActual.number(index)) {
      cellIndex = index;
    } else if ((isActual.number(column)) && (isActual.number(row))) {
      cellIndex = this.lookup.row[(row as number)][(column as number)];
    } else if (isActual.number(block)) {
      if ((isActual.number(blockRow)) && (isActual.number(blockColumn))) {
        blockIndex = this.translateBlockIndex({blockColumn, blockRow});
      }
      if (isActual.number(blockIndex)) {
        cellIndex = this.lookup.block[(block as number)][(blockIndex as number)];
      }
    }
    const cell = (isActual.number(cellIndex)) && this.grid[(cellIndex as number)];
    if (cell) {
      cell.data = data;
    }
  });
  return this.cells
};

export default Grid;
