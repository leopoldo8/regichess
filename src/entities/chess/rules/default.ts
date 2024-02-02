import GameRules, { canMovePieceProps, getPieceMovementOptionsProps, getPieceMovementOptionsResult, verifyGameOverProps } from "./index";

import { DefaultPieceColors, PieceType, TGenericPieceColor } from "../../../models";

import { PieceMovementOptions, SpecialPieceMovements } from "../../../services/pieceMovement/pieceMovement";
import BoardRelative from "../../../services/pieceMovement/boardRelative";

import Observable from "../../../utils/observable";
import TogglePieceColor from "../../../utils/togglePieceColor";
import { getRandomIntegerWithSeed } from "../../../utils/randomWithSeed";

export default class CaptureTheKingGameRules extends Observable implements GameRules {
  firstTurnPlayerColor = DefaultPieceColors.white;

  getPlayersColors(seed: number) {
    const int = getRandomIntegerWithSeed(seed);
    const randomIndex = Math.round(int);

    return Object.values(DefaultPieceColors).sort(() => 0.5 - randomIndex);
  }

  getNextTurnColor(actualTurn: TGenericPieceColor) {
    return TogglePieceColor(actualTurn);
  }

  canMovePiece({ board, piece, to }: canMovePieceProps) {
    const verifications = [
      this.canMovePiecePositionVerifications,
      this.canMovePieceMovementsVerifications,
    ];

    return verifications.every(verification => {
      return verification.bind(this)({ board, piece, to })
    });
  }

  verifyIfGameOverAndReturnWinner({ players, board }: verifyGameOverProps) {
    const kings = board.pieceMesh.findAll(piece => piece.type === PieceType.king);

    /**
     * If there's just one king on the board,
     * then the remnant color is the winner 
     */
    if (kings.length === 1) {
      return players.find(player => player.color === kings[0].item.color);
    }
  }

  // FIXME: refactor to not redo operations
  verifySpecialMovementAndMovePiecesIfNecessary({ board, piece, to }: canMovePieceProps) {
    const {
      options,
      leftRook,
      rightRook,
      adjacentLeftPawn,
      adjacentRightPawn
    } = this.getPieceMovementOptions({ board, piece, to });

    const movement = piece.getCurrentPossibleMovements(options).find(move => move.isEqualTo(to));

    switch(movement?.specialMovementType) {
      case SpecialPieceMovements.rightCastling:
        if (rightRook) {
          board.movePieceAndReplace(piece, to);
          board.movePieceAndReplace(rightRook, new BoardRelative(to, piece.color).Left(1));
          rightRook.moveCount++;
          return true;
        }

      case SpecialPieceMovements.leftCastling:
        if (leftRook) {
          board.movePieceAndReplace(piece, to);
          board.movePieceAndReplace(leftRook, new BoardRelative(to, piece.color).Right(1));
          leftRook.moveCount++;
          return true;
        }

      case SpecialPieceMovements.enPassant:
        if (adjacentLeftPawn) {
          board.movePieceAndReplace(piece, to);
          board.removePiece(adjacentLeftPawn);
          return true;
        }

        if (adjacentRightPawn) {
          board.movePieceAndReplace(piece, to);
          board.removePiece(adjacentRightPawn);
          return true;
        }

      default:
        return false;
    }
  }

  getPieceMovementOptions({ board, piece, to, preview }: getPieceMovementOptionsProps): getPieceMovementOptionsResult {
    const options: Partial<PieceMovementOptions> = {
      isTakingAPiece: to ? !board.getPieceByPosition(to) : false,
    }

    if (piece.type === PieceType.king) {
      const [leftRook, rightRook] = board.pieceMesh
        .findAll(fPiece => fPiece.type === PieceType.rook && fPiece.color === piece.color)
        .sort((a, b) => (a.item.currentPosition?.y || 0) - (b.item.currentPosition?.y || 0));

      options.leftRookMoved = leftRook.item.moveCount > 0;
      options.rightRookMoved = rightRook.item.moveCount > 0;

      return {
        options,
        leftRook: leftRook.item,
        rightRook: rightRook.item,
      }
    }

    if (piece.type === PieceType.pawn) {
      const adjacentLeftPawn = board.getPieceByPosition(new BoardRelative(piece.currentPosition!, piece.color).Left(1));
      const adjacentRightPawn = board.getPieceByPosition(new BoardRelative(piece.currentPosition!, piece.color).Right(1));

      if (adjacentLeftPawn) {
        options.pawnDoubleAdvanceFromLeft = adjacentLeftPawn.metadataForSpecialMovements?.pawnDoubleAdvanceOnLastMove;
      }

      if (adjacentRightPawn) {
        options.pawnDoubleAdvanceFromRight = adjacentRightPawn.metadataForSpecialMovements?.pawnDoubleAdvanceOnLastMove;
      }

      return {
        options,
        adjacentLeftPawn,
        adjacentRightPawn,
      }
    }
    
    return {
      options,
    }
  }

  private canMovePiecePositionVerifications({ board, piece, to }: canMovePieceProps) {
    const actualPosition = board.getPositionByPieceId(piece.id);

    /**
     * Verify if target position exists
     * and it's not already the piece current position
     */
    if (!actualPosition || actualPosition.isEqualTo(to)) return false;

    return true;
  }

  private canMovePieceMovementsVerifications({ board, piece, to }: canMovePieceProps) {
    const isTakingAPiece = !!board.getPieceByPosition(to);

    /**
     * Get all piece possible movements 
     * and verify if target movement is allowed
     */
    if (!piece.getCurrentPossibleMovements({ isTakingAPiece }).find(move => move.isEqualTo(to))) return false;

    return true;
  }
}
