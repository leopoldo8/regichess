import { v4 as uuidv4 } from 'uuid';

import Piece from '../entities/chess/piece';
import Board from '../entities/chess/board';

import { TGenericPieceColor, PieceType } from "../models";

class PieceArrange {
  constructor(
    readonly board: Board,
  ) {}

  createSingle(type: PieceType, color: TGenericPieceColor) {
    const id = uuidv4();

    return new Piece({ id, type, color}, this.board);
  }

  createMultiple(type: PieceType, color: TGenericPieceColor, quantity: number) {
    return Array(quantity).fill(0).map(() => this.createSingle(type, color));
  }
}

export default PieceArrange;
