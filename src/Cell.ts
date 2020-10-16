interface Cell {
  index: number;
  row: number;
  column: number;
  block: number;
  data: any;
}
interface Position {
  row: number;
  column: number;
  block: number;
  index: number;
}

class Cell {
  constructor({position, data}: {position: Position; data: any}) {
    this.index = position.index;
    this.row = position.row;
    this.column = position.column;
    this.block = position.block;
    this.data = data;
  }
}

export default Cell;