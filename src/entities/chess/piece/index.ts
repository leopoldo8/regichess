import Board from "../board";

import Observable from "../../../utils/observable";
import { TGenericPieceColor, PieceType } from "../../../models";

import PieceMovement, { PieceMovementOptions } from "../../../services/pieceMovement/pieceMovement";
import Position from "../../2d/position";

export interface PieceCharacteristics {
  id: string,
  type: PieceType,
  color: TGenericPieceColor,
}

export default class Piece extends Observable implements PieceCharacteristics {
  constructor(
    readonly characteristics: PieceCharacteristics,
    readonly board: Board
  ) {
    super();

    this.id = characteristics.id;
    this.type = characteristics.type;
    this.color = characteristics.color;

    this.movements = new PieceMovement(this, board);
  }

  private readonly movements: PieceMovement;

  id;
  type;
  color;

  moveCount: number = 0;

  getCurrentPossibleMovements(options: PieceMovementOptions) {
    return this.movements.updateFieldOfView(options);
  }

  get currentPosition(): Position | undefined {
    return this.board.getPositionByPieceId(this.id);
  }

  get allPossibleMovements(): Position[] {
    return this.movements.updateFieldOfView({ preview: true });
  }
}
