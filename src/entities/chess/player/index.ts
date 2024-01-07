import { TGenericPieceColor } from "../../../models";
import Position from "../../2d/position";

import Observable from "../../../utils/observable";

import Piece from "../piece";
import User from "../../user";

export type TMakeMoveEvent = { piece: Piece, position: Position };
export type TShowPiecePossibleMovementsEvent = { piece: Piece };

export default class Player extends Observable {
  constructor(
    readonly user: User,
    readonly color: TGenericPieceColor
  ) {
    super();
  }

  makeMove(piece: Piece, position: Position): void {
    this.notify<TMakeMoveEvent>('makeMove', { piece, position });
  }

  showPiecePossibleMovements(piece: Piece) {
    this.notify<TShowPiecePossibleMovementsEvent>('showPiecePossibleMovements', { piece });
  }
}
