import Board from "../board";

import Observable, { globalObservable } from "../../../utils/observable";
import { TGenericPieceColor, PieceType } from "../../../models";

import PieceMovement, { PieceMovementOptions } from "../../../services/pieceMovement/pieceMovement";
import Position from "../../2d/position";
import GameRules from "../rules";
import Observer from "../../../utils/observer";

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

  private tempGlobalObserver: ReturnType<Observable['register']> | undefined;

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
      const pawnDoubleAdvanceOnLastMove = this.moveCount === 1 && from.measureDistanceTo(to) === 2;

      this.metadataForSpecialMovements = {
        pawnDoubleAdvanceOnLastMove,
      }

      if (pawnDoubleAdvanceOnLastMove) {
        setTimeout(() => {
          this.tempGlobalObserver = globalObservable.register(new Observer('onEachTurn', () => {
            this.metadataForSpecialMovements = undefined;
          }));
        })
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
