
import GameRules from "../rules";
import Board from "../board";

import { MovementsStructuredArray } from "../../../services/pieceMovement/pieceMovement";
import { GameNetwork, TGenericPieceColor } from "../../../models";
import Observable, { globalObservable } from "../../../utils/observable";
import Position from "../../2d/position";
import Piece from "../piece";
import Player from "../player";
import User from "../../user";

export type MatchEndedEventProps = {
  winner: Player,
}

type movePieceVerificationProps = {
  player: Player,
  piece: Piece,
  to: Position
}

type verifySpecialMovementWithGameRuleProps = {
  piece: Piece,
  to: Position
}

export default class Match extends Observable {
  constructor(
    readonly gameRules: GameRules,
    readonly gameNetwork: GameNetwork,
    readonly board: Board,
    readonly users: User[],
  ) {
    super();

    this.seed = Math.random() * 100;
    console.log("Seed generated: ", this.seed);

    this.turnColor = this.gameRules.firstTurnPlayerColor;

    const playersColors = this.gameRules.getPlayersColors(this.seed);

    if (users.length !== playersColors.length) {
      throw new Error(`Invalid number of players based on Game Rules. Expected: ${playersColors.length}, got: ${users.length}`);
    }
  
    this.players = users.map((user, index) => new Player(user, playersColors[index]));
  }

  readonly seed: number;
  readonly players: Player[];

  historicMovements: MovementsStructuredArray = [];

  turnColor: TGenericPieceColor;
  turnCount: number = 1;

  status: 'active' | 'paused' | 'ended' = 'active';

  verifyRulesAndMovePiece(player: Player, piece: Piece, to: Position) {
    const verifications = [
      this.movePieceTurnVerification,
      this.movePieceRulesVerification,
    ];

    if (verifications.every(verification => verification.bind(this)({ player, piece, to }))) {
      this.turnAction(player, piece, to);
    }
  }

  getPlayerByCurrentTurn() {
    return this.getPlayerByColor(this.turnColor);
  }
  
  getPlayerByColor(color: TGenericPieceColor) {
    return this.players.find(player => player.color === color);
  }

  private async turnAction(player: Player, piece: Piece, to: Position) {
    const movementsToRun = await this.gameRules.turnAction({
      board: this.board,
      piece,
      to,
    });

    movementsToRun.forEach(movement => {
      /**
       * Verify if stills the same turn after the promise
       */
      if (!this.movePieceTurnVerification({ player, piece, to })) return;

      /**
       * TODO: add better security verifications (eg. only one piece moved per turn)
       */
      switch(movement.type) {
        case 'move':
          movement.piece.onPieceMoved(movement.piece.currentPosition!, movement.to!);
          this.board.movePieceAndReplace(movement.piece, movement.to!);
          break;
        
        case 'remove':
          this.board.removePiece(movement.piece);
          break;

        case 'transform':
          movement.piece.transformType(movement.transformType!);
          break;
      }

      this.historicMovements.push(movement);
    });

    this.passToNextTurn();
  }

  private passToNextTurn() {
    const winner = this.gameRules.verifyIfGameOverAndReturnWinner({
      players: this.players,
      board: this.board,
    });

    if (winner) {
      this.endMatch(winner);
      return;
    }

    this.turnColor = this.gameRules.getNextTurnColor(this.turnColor);
    this.turnCount++;

    globalObservable.globalNotify('onEachTurn');
  }

  private endMatch(winner: Player) {
    this.status = 'ended';
    this.notify<MatchEndedEventProps>('matchEnded', { winner });
  }

  private movePieceTurnVerification({ player, piece }: movePieceVerificationProps) {
    if (this.gameNetwork === GameNetwork.online) {
      if (player.color !== piece.color) return false;
      if (player.color !== this.turnColor) return false;
    }

    if (this.gameNetwork === GameNetwork.local) {
      if (piece.color !== this.turnColor) return false;
    }

    return true;
  }

  private movePieceRulesVerification({ piece, to }: movePieceVerificationProps) {
    return this.gameRules.canMovePiece({ board: this.board, piece, to });
  }
}
