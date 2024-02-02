export default class Position {
  constructor(
    public x: number,
    public y: number,
  ) {}

  isEqualTo(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }

  measureDistanceTo(other: Position): number {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
  }
}
