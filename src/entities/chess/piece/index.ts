import Board from "../board";

import Observable from "../../../utils/observable";
import { TGenericPieceColor, PieceType } from "../../../models";

import PieceMovement, { PieceMovementOptions } from "../../../services/pieceMovement/pieceMovement";
import Position from "../../2d/position";
import GameRules from "../rules";

export interface PieceCharacteristics {
  id: string,
  type: PieceType,
  color: TGenericPieceColor,
}

export default class Piece extends Observable implements PieceCharacteristics {
  constructor(
    readonly characteristics: PieceCharacteristics,
    readonly board: Board,
    readonly rules: GameRules,
  ) {
    super();

    this.id = characteristics.id;
    this.type = characteristics.type;
    this.color = characteristics.color;

    this.movements = new PieceMovement(this, board, rules);
  }

  private readonly movements: PieceMovement;

  id;
  type;
  color;

  moveCount: number = 0;

  metadataForSpecialMovements?: Partial<{
    pawnDoubleAdvanceOnLastMove: boolean;
  }>;

  getCurrentPossibleMovements(options: PieceMovementOptions) {
    return this.movements.updateFieldOfView(options);
  }

  onPieceMoved(from: Position, to: Position) {
    this.moveCount++;

    if (this.type === PieceType.pawn) {
      this.metadataForSpecialMovements = {
        pawnDoubleAdvanceOnLastMove: this.moveCount === 1 && from.measureDistanceTo(to) === 2,
      }
    }
  }

  transformType(newType: PieceType) {
    this.type = newType;
  }

  get currentPosition(): Position | undefined {
    return this.board.getPositionByPieceId(this.id);
  }

  get allPossibleMovements(): Position[] {
    return this.getCurrentPossibleMovements({ preview: true });
  }
}
