function Grid(columns, rows, defaultValue) {
  this.height = rows;
  this.width = columns;
  this.grid = new Array(rows).fill(new Array(columns).fill(defaultValue));
  if (defaultValue === undefined) {
    this.grid = this.grid.map((row, r) => row.map((cell, c) => c + r * this.width));
  }
}
Grid.prototype.setGrid = function (grid) {
  this.grid = grid;
};
Grid.prototype.rows = function () {
  return this.grid.slice(0);
};
Grid.prototype.columns = function () {
  const arr = [];
  for (let c = 0; c < this.width; c++) {
    arr.push(this.grid.map((row) => row[c]));
  }
  return arr;
};
Grid.prototype.diagonals = function () {
  const forwardSlashes = [];
  const backSlashes = [];
  let yShift = 0;
  let xShift = 0;
  let x = 0;
  let y = 0;
  while (xShift < this.width - 1 || yShift < this.height) {
    const forwardSlash = [];
    const backSlash = [];
    do {
      backSlash.push(this.grid[y][this.width - 1 - x]);
      forwardSlash.push(this.grid[y++][x--]);
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
Grid.prototype.blocks = function (width, height = width) {
  if (width > this.width || height > this.height) {
    console.error(`Grid.blocks given width: ${width} and ${height} exceeds maximum size width: ${this.width} and height: ${this.height}`);
    return this.grid;
  }
  const widthRemainder = this.width % width;
  const heightRemainder = this.height % height;
  const useWidth = width - widthRemainder;
  const useHeight = height - heightRemainder;
  if ((useWidth <= 1 && useHeight <= 1) || (useWidth === this.width && useHeight === this.height)) {
    console.warn('Grid.blocks width and height equal 1. Simply returing grid as flattened array');
    return this.flattenArray(this.grid);
  }
  if (widthRemainder) {
    console.warn(`Grid.blocks width: ${width} is not divisible by ${this.width} number of columns in grid. 
        Using width of ${useWidth} instead.`);
  }
  if (heightRemainder) {
    console.warn(`Grid.blocks height: ${height} is not divisible by ${this.height} number of row in grid
        Using height of ${useHeight} instead.`);
  }
  const arr = [];
  let wholeRowsFinished = 0;
  let columnCarrage = 0;
  const totalBlocks = (this.width * this.height) / (useWidth * useHeight);
  for (let b = 0; b < totalBlocks; b++) {
    let block = [];
    let startBlock = useWidth * columnCarrage;
    let endBlock = useWidth * (columnCarrage + 1);
    for (let r = wholeRowsFinished; r < useHeight + wholeRowsFinished; r++) {
      block.push(...this.grid[r].slice(startBlock, endBlock));
    }
    columnCarrage++;
    if (endBlock >= this.width) {
      columnCarrage = 0;
      wholeRowsFinished += useHeight;
    }
    arr.push(block);
  }
  return arr;
};
Grid.prototype.nths = function (n, from = this.rows(), starting = 0) {
  return this.flattenArray(from)
    .slice(starting)
    .filter((v, i) => i % n === 0);
};
Grid.prototype.merge = function (
  withArr,
  options = {
    replaceIfBigger: false,
    replaceIfSmaller: false,
    insertWhereEmpty: true,
    replaceAll: false,
  }
) {
  const {replaceIfBigger, replaceIfSmaller, insertWhereEmpty, replaceAll} = options;
  const newArr = this.flattenArray(withArr);
  const processCondition = (newValue, existingValue) => {
    if (!replaceAll) {
      if (insertWhereEmpty) {
        if (!existingValue) {
          return newValue;
        }
        return existingValue;
      } else if (!existingValue) {
        return existingValue;
      }
      if (replaceIfBigger && newValue > existingValue) {
        return newValue;
      }
      if (replaceIfSmaller && newValue < existingValue) {
        return newValue;
      }
    } else {
      return newValue;
    }
  };
  const newGrid = this.grid.map((row, rI) => row.map((cell, cI) => processCondition(newArr[cI + rI * this.width], cell)));
  this.grid = newGrid;
  return this.grid;
};
Grid.prototype.flattenArray = function (arr = this.rows()) {
  return [].concat(...arr);
};
Grid.prototype.getIndex = function (x = 0, y = 0) {
  return x + y * this.width;
};
Grid.prototype.getCoordinate = function (index = 0) {
  return {x: index % this.width, y: Math.floor(index / this.width)};
};
module.exports = Grid;

module.exports.default = Grid;
