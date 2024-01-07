import Position from "../../entities/2d/position";
import Piece from "../../entities/chess/piece";
import Board from "../../entities/chess/board";

import { PieceSingleMovement } from "./pieceMovement";

export interface IFieldOfViewItem {
  position: Position;
  piece: Piece;
}

export interface IFindPiece {
  direction: string;
  index: number;
}

export type TFieldOfView = IFieldOfViewItem[];

class PieceFieldOfView {
  constructor(
    readonly piece: Piece,
    readonly board: Board,
  ) {}

  fieldOfView = new Map<string, TFieldOfView>();

  applyPieceFOVOnMovements(movements: Position[], direction: string) {
    return movements.filter(movement => !this.detectCollisionOnSquare(movement, direction)) as PieceSingleMovement;
  }

  private detectCollisionOnSquare(coords: Position, direction: string): boolean {
    const piece = this.board.getPieceByPosition(coords)
    const fieldOfViewDirection = this.createOrGetDirectionFromFOV(direction);

    /**
     * Knight edge case
     * If the piece has the same color, then it's a collision
     * If not, then it is not a collision.
     */
    if (direction === 'outOfFieldOfView') {
      if (piece) {
        if (piece.color == this.piece.color) {
          return true;
        }

        this.addItemToFOV(direction, { piece, position: coords });
      }

      return false;
    }

    if (piece) {
      const isSameColor = piece.color === this.piece.color;

      this.addItemToFOV(direction, { piece, position: coords });

      if (isSameColor) {
        /**
         * If the piece has the same color, then
         * the piece should not move any point further
         */
        return true;
      } else {
        /**
         * If the piece has a different same color, then
         * the piece should move only the sufficient to capture it
         */
        return fieldOfViewDirection.length > 1;
      }
    }

    /**
     * If there is no piece, then
     * the piece should be able to move since there
     * wasn't any piece blocking the way before
     */
    return !!fieldOfViewDirection.length;
  }

  private createOrGetDirectionFromFOV(direction: string): TFieldOfView {
    if (this.fieldOfView.has(direction)) {
      return this.fieldOfView.get(direction) as TFieldOfView;
    }

    const initialValue: TFieldOfView = [];
    this.fieldOfView.set(direction, initialValue);

    return initialValue;
  }

  private addItemToFOV(direction: string, item: IFieldOfViewItem) {
    const fov = this.createOrGetDirectionFromFOV(direction);

    fov.push(item);
    this.fieldOfView.set(direction, fov);
  }

  findPieceInFOV(id: string): null | IFindPiece {
    let result = null;

    this.fieldOfView.forEach((pieces, direction) => {
      const index = pieces.findIndex(({ piece }) => piece.id === id);

      if (index >= 0) {
        result = {
          index,
          direction
        };

        return;
      }
    });

    return result;
  }
}

export default PieceFieldOfView;
