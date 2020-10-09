import Cell from './Cell';

interface Position {
  row: number;
  column: number;
  block: number;
  index: number;
}

function Grid({columns, rows, blockSize, defaultValue}: {columns: number; rows: number; blockSize: number[]; defaultValue?: any}) {
  this.height = rows;
  this.width = columns;
  this.blockSize = blockSize || [columns, rows];
  this.lookup = {
    row: {},
    column: {},
    block: {},
  };
  this.grid = new Array(rows * columns).fill({}).map((cell, index) => {
    const position = this.translate({index});
    this.addToLookup(position);
    return new Cell({position, data: defaultValue !== undefined ? defaultValue : index});
  });
  this.getCell = this.getCell.bind(this);

  const self = this;
  Object.defineProperties(this, {
    cells: {
      get() {
        return [...self.grid.map((cell) => cell.data)];
      },
      set(arr) {
        // reinitalise grid
      },
    },
    rows: {
      get() {
        return self.getRows();
      },
      set(arr) {
        // flatten arr and reinitalise grid
      },
    },
    columns: {
      get() {
        return self.getColumns();
      },
      set(arr) {
        // reverse getColumns and reinitalise grid
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
Grid.prototype.rows = Grid.prototype.addToLookup = function (position: Position) {
  const addType = ({type, location, index}) => (Array.isArray(this.lookup[type][location]) ? this.lookup[type][location].push(index) : (this.lookup[type][location] = [index]));
  Object.keys(position)
    .filter((type) => type !== 'index')
    .forEach((type) => addType({type, location: position[type], index: position.index}));
};
Grid.prototype.translate = function ({index, row, column}: {index?: number; row?: number; column?: number}): Position {
  if (index === undefined && (!row || !column)) {
    throw Error('Grid.prototype.translate requires an index or row and column!');
  }
  let output = {
    row,
    column,
    block: null,
    index,
  };
  if (Number.isInteger(index)) {
    const coordinates = this.translateCoordinate({index});
    output = {...output, ...coordinates};
  } else {
    output.index = this.translateIndex({column, row});
  }
  const blockCol = Math.floor(output.column / this.blockSize[0]);
  const blockRow = Math.floor(output.row / this.blockSize[1]);
  output.block = blockCol + blockRow * this.blockSize[1];
  return output;
};
Grid.prototype.translateIndex = function ({column, row}) {
  return column + row * this.width;
};
Grid.prototype.translateCoordinate = function ({index}) {
  return {column: index % this.width, row: Math.floor(index / this.width)};
};
Grid.prototype.getData = function (as) {
  const output = Object.keys(this.lookup[as])
    .sort()
    .map((asIndex) => this.lookup[as][asIndex].map((cellIndex) => this.grid[cellIndex].data));
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
Grid.prototype.getNths = function (n, starting = 0) {
  return this.grid
    .slice(starting)
    .filter((v, i) => i % n === 0)
    .map((cell) => cell.data);
};
Grid.prototype.getCell = function ({index, column, row}) {
  let output;
  let cellIndex;
  if (isValidNumber(index)) {
    cellIndex = index;
  } else if (isValidNumber(column) && isValidNumber(row)) {
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

export default Grid;

function isValidNumber(n) {
  return n !== null && !Array.isArray(n) && !isNaN(n) && !(typeof n === 'string' && n.trim() === '');
}
