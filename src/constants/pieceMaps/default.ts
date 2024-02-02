import Board from "../../entities/chess/board";
import GameRules from "../../entities/chess/rules";

import { TGenericPieceColor, PieceType, DefaultPieceColors } from "../../models"
import PieceArrange from "../../utils/pieceArrange"

const getDefault = (rules: GameRules) => (board: Board) => {
  const pieceArrange = new PieceArrange(board, rules);
  
  const firstRowArrangement = (color: TGenericPieceColor) => [
    pieceArrange.createSingle(PieceType.rook, color),
    pieceArrange.createSingle(PieceType.knight, color),
    pieceArrange.createSingle(PieceType.bishop, color),
    pieceArrange.createSingle(PieceType.queen, color),
    pieceArrange.createSingle(PieceType.king, color),
    pieceArrange.createSingle(PieceType.bishop, color),
    pieceArrange.createSingle(PieceType.knight, color),
    pieceArrange.createSingle(PieceType.rook, color)
  ];
  
  return [
    firstRowArrangement(DefaultPieceColors.black),
    pieceArrange.createMultiple(PieceType.pawn, DefaultPieceColors.black, 8),
    [],
    [],
    [],
    [],
    pieceArrange.createMultiple(PieceType.pawn, DefaultPieceColors.white, 8),
    firstRowArrangement(DefaultPieceColors.white),
  ];
}

export default getDefault;
