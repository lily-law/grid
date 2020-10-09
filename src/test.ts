const Grid = require('./index.js');
var args = process.argv.slice(2);
const width = 9;
const height = 9;
const verbose = args.length > 0 && args[0].toLowerCase() == 'verbose';

console.group();
const grid = new Grid(width, height);
test('rows', grid.rows(), [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, 32, 33, 34, 35],
  [36, 37, 38, 39, 40, 41, 42, 43, 44],
  [45, 46, 47, 48, 49, 50, 51, 52, 53],
  [54, 55, 56, 57, 58, 59, 60, 61, 62],
  [63, 64, 65, 66, 67, 68, 69, 70, 71],
  [72, 73, 74, 75, 76, 77, 78, 79, 80],
]);
test('columns', grid.columns(), [
  [0, 9, 18, 27, 36, 45, 54, 63, 72],
  [1, 10, 19, 28, 37, 46, 55, 64, 73],
  [2, 11, 20, 29, 38, 47, 56, 65, 74],
  [3, 12, 21, 30, 39, 48, 57, 66, 75],
  [4, 13, 22, 31, 40, 49, 58, 67, 76],
  [5, 14, 23, 32, 41, 50, 59, 68, 77],
  [6, 15, 24, 33, 42, 51, 60, 69, 78],
  [7, 16, 25, 34, 43, 52, 61, 70, 79],
  [8, 17, 26, 35, 44, 53, 62, 71, 80],
]);
test('diagonals', grid.diagonals(), [
  [
    [0],
    [1, 9],
    [2, 10, 18],
    [3, 11, 19, 27],
    [4, 12, 20, 28, 36],
    [5, 13, 21, 29, 37, 45],
    [6, 14, 22, 30, 38, 46, 54],
    [7, 15, 23, 31, 39, 47, 55, 63],
    [8, 16, 24, 32, 40, 48, 56, 64, 72],
    [17, 25, 33, 41, 49, 57, 65, 73],
    [26, 34, 42, 50, 58, 66, 74],
    [35, 43, 51, 59, 67, 75],
    [44, 52, 60, 68, 76],
    [53, 61, 69, 77],
    [62, 70, 78],
    [71, 79],
    [80],
  ],
  [
    [8],
    [7, 17],
    [6, 16, 26],
    [5, 15, 25, 35],
    [4, 14, 24, 34, 44],
    [3, 13, 23, 33, 43, 53],
    [2, 12, 22, 32, 42, 52, 62],
    [1, 11, 21, 31, 41, 51, 61, 71],
    [0, 10, 20, 30, 40, 50, 60, 70, 80],
    [9, 19, 29, 39, 49, 59, 69, 79],
    [18, 28, 38, 48, 58, 68, 78],
    [27, 37, 47, 57, 67, 77],
    [36, 46, 56, 66, 76],
    [45, 55, 65, 75],
    [54, 64, 74],
    [63, 73],
    [72],
  ],
]);
test('blocks(3, 3)', grid.blocks(3, 3), [
  [0, 1, 2, 9, 10, 11, 18, 19, 20],
  [3, 4, 5, 12, 13, 14, 21, 22, 23],
  [6, 7, 8, 15, 16, 17, 24, 25, 26],
  [27, 28, 29, 36, 37, 38, 45, 46, 47],
  [30, 31, 32, 39, 40, 41, 48, 49, 50],
  [33, 34, 35, 42, 43, 44, 51, 52, 53],
  [54, 55, 56, 63, 64, 65, 72, 73, 74],
  [57, 58, 59, 66, 67, 68, 75, 76, 77],
  [60, 61, 62, 69, 70, 71, 78, 79, 80],
]);
test('nths(3)', grid.nths(3), [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78]);
test('merge([9,8,7,6,5,4,3,2,1])', grid.merge([9, 8, 7, 6, 5, 4, 3, 2, 1]), [
  [9, 1, 2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, 32, 33, 34, 35],
  [36, 37, 38, 39, 40, 41, 42, 43, 44],
  [45, 46, 47, 48, 49, 50, 51, 52, 53],
  [54, 55, 56, 57, 58, 59, 60, 61, 62],
  [63, 64, 65, 66, 67, 68, 69, 70, 71],
  [72, 73, 74, 75, 76, 77, 78, 79, 80],
]);
test('flattenArray', grid.flattenArray(), [
  9,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  64,
  65,
  66,
  67,
  68,
  69,
  70,
  71,
  72,
  73,
  74,
  75,
  76,
  77,
  78,
  79,
  80,
]);
test('getIndex(3, 3)', grid.getIndex(3, 3), 30);
test('getCoordinate', grid.getCoordinate(30), {x: 3, y: 3});
console.log('End of Test');
console.groupEnd();

function test(name, input, expectedOutput) {
  console.group();
  if (verbose) {
    console.log(name + ': ');
    console.log(input);
  }
  const condition = JSON.stringify(input) === JSON.stringify(expectedOutput);
  condition && console.log('OK: ' + name);
  console.assert(condition, `return from ${name} not as expected`);
  console.groupEnd();
}
