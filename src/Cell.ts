interface Cell {
  index: number;
  row: number;
  column: number;
  block: number;
  _data: any;
  includeDetails: boolean;
}
interface Position {
  row: number;
  column: number;
  block: number;
  index: number;
}

class Cell {
  constructor({position, data, includeDetails}: {position: Position; data: any, includeDetails: boolean}) {
    this.index = position.index;
    this.row = position.row;
    this.column = position.column;
    this.block = position.block;
    this._data = data;
    this.includeDetails = includeDetails;
    this.setValue = this.setValue.bind(this)
  }
  setValue(value: any) {
    this._data = value;
  }
  get data() {
    if (this.includeDetails) {
      const thisCell = this;
      return {
        index: this.index,
        row: this.row,
        column: this.column,
        block: this.block,
        set value(val) {
          thisCell._data = val
        },
        get value(): any {
          return thisCell._data
        },
        hasDetailsFromGridPackage: true
      }
    }
    else {
      return this._data
    }
  }
  set data(value) {
    this.setValue(value)
  }
}

export default Cell;