import Cell from './Cell';

interface CoordinateLocation {
  [index: string]: number;
  row: number;
  column: number;
}
interface IndexLocation {
  [index: string]: number;
  index: number;
}
interface BlockLocation {
  [index: string]: number | undefined;
  block: number;
  blockIndex?: number;
  blockRow?: number;
  blockColumn?: number;
}

type Position = CoordinateLocation & IndexLocation & BlockLocation;
type CellLocation = CoordinateLocation | IndexLocation | BlockLocation;
interface CellData {
  data: any;
}
type Cell = CoordinateLocation & IndexLocation & BlockLocation & CellData;

interface BlockSize {
  width: number;
  height: number;
}

interface Lookup {
  [index: string]: object;
  row: object;
  column: object;
  block: object;
}
type LookupType = 'row' | 'column' | 'block' | string;

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
  translateIndex: (cellLocation: CellLocation, width?: number) => number;
  cells: any[];
  rows: any[];
  columns: any[];
  blocks: any[];
  diagonals: any[];
  getNths: (n: number, starting?: number) => any[];
  getCell: (cellLocation: CellLocation) => any;
  updateCells: (arr: (CellLocation & CellData)[]) => boolean;
}

function Grid(this: Grid, {columns, rows, blockSize, defaultValue}: {columns?: number; rows?: number; blockSize: {width: number; height?: number}; defaultValue?: any}): void {
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

  const self = this;
  Object.defineProperties(this, {
    cells: {
      get() {
        return self.grid.map((cell: Cell) => cell.data);
      },
      set(arr) {
        if (!Array.isArray(arr)) {
          throw Error(`Cannot set cells to be of type ${typeof arr}, must be an array!`);
        }
        this.initGrid(arr);
      },
    },
    rows: {
      get() {
        return self.getRows();
      },
      set(arr) {
        const flatArray = Array.isArray(arr) && arr.flat();
        if (!flatArray) {
          throw Error(`Cannot set rows with ${arr}`);
        }
        this.initGrid(flatArray);
      },
    },
    columns: {
      get() {
        return self.getColumns();
      },
      set(arr) {
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
      },
    },
    blocks: {
      get() {
        return self.getBlocks();
      },
      set(arr) {
        // reverse getBlocks and reinitalise grid
      },
    },
    diagonals: {
      get() {
        return self.getDiagonals();
      },
      set(arr) {
        // reverse getDiagonals and reinitalise grid
      },
    },
  });
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
Grid.prototype.addToLookup = function (position: Position) {
  const addEntry = ({type, location, index}: {type: LookupType; location: any; index: number}) =>
    Array.isArray(this.lookup[type][location]) ? this.lookup[type][location].push(index) : (this.lookup[type][location] = [index]);
  Object.keys(position)
    .filter((type) => type !== 'index')
    .forEach((type) => addEntry({type, location: position[type], index: position.index}));
};
Grid.prototype.translate = function ({index, row, column}: {index?: number; row?: number; column?: number}): Position {
  if (index === undefined && (!row || !column)) {
    throw Error('Grid.prototype.translate requires an index or row and column!');
  }
  let output: Position = {
    row: row || NaN,
    column: column || NaN,
    block: NaN,
    index: index || NaN,
  };
  if (index || index === 0) {
    const coordinates = this.translateCoordinate({index});
    output = {...output, ...coordinates};
  } else {
    output.index = this.translateIndex({column, row});
  }
  output.block = this.translateBlock({column: output.column, row: output.row});
  return output;
};
Grid.prototype.translateIndex = function (this: Grid, cellLocation: CellLocation, width: number = this.width): number {
  const {index, column, row, block, blockIndex, blockRow, blockColumn} = cellLocation;
  let cellIndex;
  if (cellLocation.index || cellLocation.index === 0) {
    cellIndex = index;
  } else if ((column || column === 0) && (row || row === 0)) {
    cellIndex = column + row * width;
  } else if (block || block === 0) {
    if (blockIndex || blockIndex === 0) {
      cellIndex = block * (this.blockSize.width * this.blockSize.height) + blockIndex;
    } else if ((blockRow || blockRow === 0) && (blockColumn || blockColumn === 0)) {
      const blockIndex = this.translateIndex({row: blockRow, column: blockColumn}, this.blockSize.width);
      cellIndex = this.translateIndex({block, blockIndex});
    }
  }
  if (!(cellIndex || cellIndex === 0)) {
    throw Error(`Grid.prototype.translateIndex failed to produce an index. Input arguments: cellLocation: ${cellLocation} width: ${width}`)
  }
  return cellIndex
};
Grid.prototype.translateCoordinate = function ({index}: IndexLocation): CoordinateLocation {
  return {column: index % this.width, row: Math.floor(index / this.width)};
};
Grid.prototype.translateBlock = function ({column, row}: CoordinateLocation): number {
  const blockCol = Math.floor(column / this.blockSize.width);
  const blockRow = Math.floor(row / this.blockSize.height);
  return blockCol + blockRow * this.blockSize.height;
};
Grid.prototype.translateBlockIndex = function ({blockColumn, blockRow}: {blockColumn: number; blockRow: number}) {
  return this.blockSize.width * blockRow + blockColumn;
};
Grid.prototype.getData = function (as: LookupType) {
  const output = Object.keys(this.lookup[as])
    .sort()
    .map((asIndex) => this.lookup[as][asIndex].map((cellIndex: number) => this.grid[cellIndex].data));
  return output;
};
Grid.prototype.getRows = function () {
  return this.getData('row');
};
Grid.prototype.getColumns = function () {
  return this.getData('column');
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
  return this.getData('block');
};
Grid.prototype.getNths = function (n: number, starting = 0) {
  return this.grid
    .slice(starting)
    .filter((v: Cell, i: number) => i % n === 0)
    .map((cell: Cell) => cell.data);
};
Grid.prototype.getCell = function ({index, column, row}: CellLocation) {
  let output;
  let cellIndex;
  if (index || index === 0) {
    cellIndex = index;
  } else if ((column || column === 0) && (row || row === 0)) {
    cellIndex = this.translateIndex({column, row});
  }
  if (cellIndex) {
    const cell = this.grid[cellIndex];
    if (cell) {
      output = {...cell}.data;
    }
  }
  return output;
};
Grid.prototype.updateCells = function (arr: (CellLocation & CellData)[]) {
  arr.forEach(({index, column, row, block, blockIndex, blockRow, blockColumn, data}) => {
    let cellIndex;
    if (index || index === 0) {
      cellIndex = index;
    } else if ((column || column === 0) && (row || row === 0)) {
      cellIndex = this.lookup.row[row][column];
    } else if (block || block === 0) {
      if ((blockRow || blockRow === 0) && (blockColumn || blockColumn === 0)) {
        blockIndex = this.translateBlockIndex({blockColumn, blockRow});
      }
      if (blockIndex || blockIndex === 0) {
        cellIndex = this.lookup.block[block][blockIndex];
      }
    }
    const cell = (cellIndex || cellIndex === 0) && this.grid[cellIndex];
    if (cell) {
      cell.data = data;
      return true;
    }
    else {
      return false;
    }
  });
};

export default Grid;
