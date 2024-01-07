import Observable from "../../../utils/observable";

import { GameNetwork, TGenericPieceColor } from "../../../models";
import GameRules from "../rules";
import Board from "../board";

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

  turnColor: TGenericPieceColor;
  turnCount: number = 1;

  status: 'active' | 'paused' | 'ended' = 'active';

  verifyRulesAndMovePiece(player: Player, piece: Piece, to: Position) {
    const verifications = [
      this.movePieceTurnVerification,
      this.movePieceRulesVerification,
    ];

    if (verifications.every(verification => verification.bind(this)({ player, piece, to }))) {
      this.turnAction(piece, to);
    }
  }

  getPlayerByCurrentTurn() {
    return this.getPlayerByColor(this.turnColor);
  }
  
  getPlayerByColor(color: TGenericPieceColor) {
    return this.players.find(player => player.color === color);
  }

  private turnAction(piece: Piece, to: Position) {
    this.board.movePieceAndReplace(piece, to);
    piece.moveCount++;

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
