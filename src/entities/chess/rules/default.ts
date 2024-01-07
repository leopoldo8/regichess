import GameRules, { canMovePieceProps, verifyGameOverProps } from "./index";

import { DefaultPieceColors, PieceType, TGenericPieceColor } from "../../../models";

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
