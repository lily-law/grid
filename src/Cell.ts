export default function Cell({position, data}) {
  this.index = position.index;
  this.row = position.row;
  this.column = position.column;
  this.block = position.block;
  this.data = data;
}
