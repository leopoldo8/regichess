import Player, { TMakeMoveEvent, TShowPiecePossibleMovementsEvent } from "../../entities/chess/player";
import Match from "../../entities/chess/match";
import Position from "../../entities/2d/position";

import Observer from "../../utils/observer";

import ChessBoardController from "../../controllers/chessboard";
import PieceController from "../../controllers/piece";
import { TGenericPieceColor } from "../../models";
import GameMoveListController from "../../controllers/gameMoveList";

export default class MatchControllersAdapter {
  constructor(
    private readonly match: Match
  ) {
    this.chessboardController = new ChessBoardController(this.match);

    this.gameMoveListController = new GameMoveListController(this.match);

    this.instantiatePlayerEvents();
  }

  private readonly gameMoveListController: GameMoveListController;

  private readonly chessboardController: ChessBoardController;

  instantiatePlayerEvents() {
    this.match.players.forEach((player) => {
      player.register(new Observer<TMakeMoveEvent>('makeMove', (props) => this.onMakeMovie(player, props)));

      player.register(new Observer<TShowPiecePossibleMovementsEvent>('showPiecePossibleMovements', (props) => this.onShowPiecePossibleMovements(player, props)));

      return player;
    });
  }

  onMakeMovie(player: Player, { piece, position }: TMakeMoveEvent) {
    this.match.verifyRulesAndMovePiece(player, piece, position);
  }

  onShowPiecePossibleMovements(player: Player, { piece }: TShowPiecePossibleMovementsEvent) {
    if (player.color !== piece.color) return;
    if (this.match.turnColor !== player.color) return;

    this.chessboardController.showPiecePossibleMovements(piece);
  }

  instantiatePieceController(x: number, y: number) {
    const piece = this.match.board.getPieceByPosition(new Position(x, y));

    if (!piece) return null;

    const player = this.match.getPlayerByColor(piece.color);

    if (!player) return null;
    
    return new PieceController(piece, this.match.board, player, this.chessboardController);
  }

  instantiateChessBoardController() {
    return this.chessboardController;
  }

  instantiateGameMoveListController() {
    return this.gameMoveListController;
  }

  getCurrentPlayerInfo(): { name?: string; color?: TGenericPieceColor; } {
    const player = this.match.getPlayerByCurrentTurn();
    
    return {
      name: player?.user.contactInfo?.name,
      color: player?.color
    }
  }
}
