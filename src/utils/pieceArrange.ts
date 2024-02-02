import { v4 as uuidv4 } from 'uuid';

import Piece from '../entities/chess/piece';
import Board from '../entities/chess/board';
import GameRules from '../entities/chess/rules';

import { TGenericPieceColor, PieceType } from "../models";

class PieceArrange {
  constructor(
    readonly board: Board,
    readonly rules: GameRules,
  ) {}

  createSingle(type: PieceType, color: TGenericPieceColor) {
    const id = uuidv4();

    return new Piece({ id, type, color }, this.board, this.rules);
  }

  createMultiple(type: PieceType, color: TGenericPieceColor, quantity: number) {
    return Array(quantity).fill(0).map(() => this.createSingle(type, color));
  }
}

export default PieceArrange;
