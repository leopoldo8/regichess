import PieceFieldOfView from "./pieceFieldOfView";

import { PawnMovement } from "./movementsByType/pawn";
import { KnightMovement } from "./movementsByType/knight";
import { BishopMovement } from "./movementsByType/bishop";
import { RookMovement } from "./movementsByType/rook";
import { QueenMovement } from "./movementsByType/queen";
import { KingMovement } from "./movementsByType/king";

import Position from "../../entities/2d/position";
import Piece from "../../entities/chess/piece";
import Board from "../../entities/chess/board";
import { TGenericPieceColor, PieceType } from "../../models";

export type PieceSingleMovement = Position[];

export type PieceMovementSegmentsKey = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'top' | 'bottom' | 'right' | 'left' | 'outOfFieldOfView';

export type GenericPieceMovementSegments = Partial<{ [key: string]: PieceSingleMovement }>;

export interface PieceMovementSegments extends GenericPieceMovementSegments {
  topLeft?: PieceSingleMovement;
  top?: PieceSingleMovement;
  topRight?: PieceSingleMovement;
  left?: PieceSingleMovement;
  right?: PieceSingleMovement;
  bottomLeft?: PieceSingleMovement;
  bottom?: PieceSingleMovement;
  bottomRight?: PieceSingleMovement;
  outOfFieldOfView?: PieceSingleMovement;
}

export type PieceMovementOptions = {
  isTakingAPiece?: boolean;
  preview?: boolean;
}

export type PieceMovementProps = PieceMovementOptions & {
  moveCount: number;
  color: TGenericPieceColor;
  position: Position;
}

export type GetPieceMovement = (props: PieceMovementProps) => PieceMovementSegments;

class PieceMovement {
  constructor(
    readonly piece: Piece,
    readonly board: Board,
  ) {
    this.fieldOfView = new PieceFieldOfView(this.piece, this.board);
  }

  fieldOfView: PieceFieldOfView;

  movements: Record<PieceType, GetPieceMovement> = {
    [PieceType.pawn]: PawnMovement,
    [PieceType.knight]: KnightMovement,
    [PieceType.bishop]: BishopMovement,
    [PieceType.rook]: RookMovement,
    [PieceType.queen]: QueenMovement,
    [PieceType.king]: KingMovement
  }

  getPossibleMovementsByPieceType(options: PieceMovementOptions): PieceSingleMovement {
    this.fieldOfView = new PieceFieldOfView(this.piece, this.board);
    const movement = this.getSegmentsByType(options);

    const resultantMovements = Object.keys(movement).map(key => {
      const movements = movement[key] as Position[];
      const possibleMovements = this.sanitizeMovementResult(movements);

      return this.fieldOfView.applyPieceFOVOnMovements(possibleMovements, key);
    });

    return this.flattenPieceMovement(resultantMovements);
  }

  updateFieldOfView(options: PieceMovementOptions) {
    return this.getPossibleMovementsByPieceType(options);
  }

  private getSegmentsByType(options: PieceMovementOptions) {
    const props: PieceMovementProps = {
      preview: options.preview,
      isTakingAPiece: options.isTakingAPiece,
      moveCount: this.piece.moveCount,
      color: this.piece.color,
      position: this.piece.currentPosition as Position
    }

    return this.movements[this.piece.type](props);
  }

  private sanitizeMovementResult(movements: PieceSingleMovement): PieceSingleMovement {
    return movements.filter((movement, index) => (
      !Number.isNaN(movement.x)
      && !Number.isNaN(movement.y)
      && movement.y <= 8
      && movement.y >= 0
      && (movement.x !== this.piece.currentPosition?.x || movement.y !== this.piece.currentPosition?.y)
      && movements.findIndex(fm => fm.isEqualTo(movement)) === index
    ));
  }

  private flattenPieceMovement(movements: PieceMovementSegments | PieceSingleMovement[], flatArray: boolean = true): any {
    const arr = Array.isArray(movements) ? movements : Object.keys(movements).map(key => movements[key]);

    if (flatArray) {
      return arr.flat();
    }

    return arr;
  }
}

export default PieceMovement;
