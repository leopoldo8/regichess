import { DefaultPieceColors, TGenericPieceColor } from "../../models";
import Position from "../../entities/2d/position";

class BoardRelative {
  constructor(
    private readonly coords: Position,
    private readonly color: TGenericPieceColor
  ) {}

  Up(amountProp: number, overrideCoords?: Position): Position {
    const { x, y } = overrideCoords || this.coords;
    const amount = this.getRelativeAmountByColor(amountProp);

    const newX = x - amount;

    return new Position(newX, y);
  }

  Left(amountProp: number, overrideCoords?: Position): Position {
    const { x, y } = overrideCoords || this.coords;

    const newY = y - amountProp;

    return new Position(x, newY);
  }

  Right(amountProp: number, overrideCoords?: Position): Position {
    const { x, y } = overrideCoords || this.coords;

    const newY = y + amountProp;

    return new Position(x, newY);
  }

  Down(amountProp: number, overrideCoords?: Position): Position {
    const { x, y } = overrideCoords || this.coords;
    const amount = this.getRelativeAmountByColor(amountProp);

    const newX = x + amount;

    return new Position(newX, y);
  }

  Diagonal(xDir: 'left' | 'right', yDir: 'top' | 'bottom'): (amountProp: number, overrideCoords?: Position) => Position {
    return (amountProp: number, overrideCoords?: Position) => {
      const initialPos = overrideCoords || this.coords;
      
      const pos = yDir === 'top' ? this.Up(amountProp, initialPos) : this.Down(amountProp, initialPos);
  
      return xDir === 'left' ? this.Left(amountProp, pos) : this.Right(amountProp, pos);
    }
  }

  SequenceOfMovement(movement: (amountProp: number, overrideCoords?: Position) => Position, count: number) {
    return Array.from<unknown[], Position>(Array(count), (v, i) => movement.bind(this, i)());
  }

  isEighthRank(overrideCoords?: Position) {
    const { x } = overrideCoords || this.coords;

    if (this.color === DefaultPieceColors.black) {
      return x === 7;
    }

    return x === 0;
  }

  private getRelativeAmountByColor(amount: number) {
    if (this.color === DefaultPieceColors.black) {
      return -amount;
    }

    return amount;
  }
}

export default BoardRelative;
