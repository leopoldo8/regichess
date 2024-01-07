import Position from "./position";

export default class Mesh2D<T> {
  constructor(
    readonly matrix: T[][]
  ) {}

  replaceAll(item: T) {
    for (let x = 0; x < this.matrix.length; x++) {
      if (!this.matrix[x]) this.matrix[x] = [];

      for (let y = 0; y < this.matrix.length; y++) {
        this.matrix[x][y] = item;
      }
    }
  }

  updateAll(newItemProperties: Partial<T>) {
    for (let x = 0; x < this.matrix.length; x++) {
      for (let y = 0; y < this.matrix.length; y++) {
        this.update(newItemProperties, new Position(x, y));
      }
    }
  }

  bulkUpdate(newItemProperties: Partial<T>, positions: Position[]): void {
    positions.forEach(position => {
      this.update(newItemProperties, position);
    });
  }

  safeInsert(item: T, position: Position): boolean {
    const positionToInsert = this.matrix[position.x][position.y];

    if (!positionToInsert) {
      this.matrix[position.x][position.y] = item;
      return true;
    }

    return false;
  }

  update(newItemProperties: Partial<T>, position: Position): boolean {
    if (this.matrix[position.x] && this.matrix[position.x][position.y]) {
      this.matrix[position.x][position.y] = {
        ...this.matrix[position.x][position.y],
        ...newItemProperties
      };

      return true;
    }

    return false;
  }
  
  replace(item: T, position: Position): T | undefined {
    const previousItem = this.matrix[position.x][position.y];
    this.matrix[position.x][position.y] = item;

    return previousItem;
  }

  push(item: T): number {
    return this.matrix[this.matrix[0].length - 1].push(item);
  }

  pop(): T | undefined {
    return this.matrix[this.matrix[0].length - 1].pop();
  }

  delete(position: Position) {
    delete this.matrix[position.x][position.y];
  }

  find(predicate: (value: T, index: Position, obj: T[][]) => boolean): { item: T, index: Position } | undefined {
    for (let x = 0; x < this.matrix.length; x++) {
      for (let y = 0; y < this.matrix.length; y++) {
        const index = new Position(x, y);
        const item = this.matrix[x][y];

        if (item && predicate(item, index, this.matrix)) {
          return { item, index };
        }
      }
    }
  }

  findAll(predicate: (value: T, index: Position, obj: T[][]) => boolean): { item: T, index: Position }[] {
    const results = [];

    for (let x = 0; x < this.matrix.length; x++) {
      for (let y = 0; y < this.matrix.length; y++) {
        const index = new Position(x, y);
        const item = this.matrix[x][y];

        if (item && predicate(item, index, this.matrix)) {
          results.push({ item, index });
        }
      }
    }

    return results;
  }
}
