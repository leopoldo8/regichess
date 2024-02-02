import Board from "../board";
import Piece from "../piece";
import Player from "../player";
import Position from "../../2d/position";

import Observable from "../../../utils/observable";
import { TGenericPieceColor } from "../../../models";
import { PieceMovementOptions } from "../../../services/pieceMovement/pieceMovement";

export type getPieceMovementOptionsProps = {
  piece: Piece,
  board: Board,
  to?: Position,
  preview?: boolean,
}

export type getPieceMovementOptionsResult = {
  options: Partial<PieceMovementOptions>,
  leftRook?: Piece | null,
  rightRook?: Piece | null,
  adjacentLeftPawn?: Piece | null,
  adjacentRightPawn?: Piece | null,
}


export type canMovePieceProps = {
  board: Board,
  piece: Piece,
  to: Position,
}

export type verifyGameOverProps = {
  players: Player[],
  board: Board,
}

export default abstract class GameRules extends Observable {
  abstract firstTurnPlayerColor: TGenericPieceColor;
  abstract getPlayersColors: (seed: number) => TGenericPieceColor[];
  abstract canMovePiece: (props: canMovePieceProps) => boolean;
  abstract getNextTurnColor: (actualTurn: TGenericPieceColor) => TGenericPieceColor;
  abstract verifyIfGameOverAndReturnWinner: (props: verifyGameOverProps) => Player | undefined;
  abstract verifySpecialMovementAndMovePiecesIfNecessary: (props: canMovePieceProps) => boolean;
  abstract getPieceMovementOptions: (props: getPieceMovementOptionsProps) => getPieceMovementOptionsResult;
}
