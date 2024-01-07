import Piece from "../entities/chess/piece";
import Position from "../entities/2d/position";
import Player from "../entities/chess/player";
import Match, { MatchEndedEventProps } from "../entities/chess/match";

import Observer from "../utils/observer";

import BoardUIAdapter from "../adapters/board/BoardUIAdapter";

export default class ChessBoardController {
  constructor(
    private readonly match: Match
  ) {
    this.boardUIAdapter = new BoardUIAdapter(this.match.board);

    this.match.register(new Observer<MatchEndedEventProps>('matchEnded', this.showMatchWinner.bind(this)));
  }

  private readonly boardUIAdapter: BoardUIAdapter;

  private selectedPiece?: Piece;

  private winnerPlayer?: Player;

  onBoardClick(x: number, y: number) {
    if (this.getOrCreateCellUIData(x, y).displayPossibleMovementIndicator && this.selectedPiece) {
      this.match.getPlayerByCurrentTurn()?.makeMove(this.selectedPiece, new Position(x, y));
    }

    this.hidePiecePossibleMovements();
  }

  hidePiecePossibleMovements() {
    if (this.boardUIAdapter.state.showingPossibleMovements) {
      this.boardUIAdapter.setPossibleMovementsVisibility(false);
      this.boardUIAdapter.state.showingPossibleMovements = false;
    }

    this.selectedPiece = undefined;
  }

  showPiecePossibleMovements(piece: Piece) {
    this.boardUIAdapter.setPossibleMovementsVisibility(false);
    this.boardUIAdapter.setPossibleMovementsVisibility(true, piece.allPossibleMovements);
    this.selectedPiece = piece;
  }

  showMatchWinner(props: MatchEndedEventProps) {
    this.winnerPlayer = props.winner;
  }

  registerObservable(callback: () => void) {
    const boardSubscription = this.match.board.register(new Observer('*', callback));
    const boardUISubscription = this.boardUIAdapter.register(new Observer('*', callback));

    return {
      boardSubscription,
      boardUISubscription
    };
  }

  getOrCreateCellUIData(x: number, y: number) {
    return this.boardUIAdapter.getOrCreateCellUIData(x, y);
  }

  getMatchWinner() {
    if (this.winnerPlayer) {
      return {
        name: this.winnerPlayer?.user.contactInfo?.name,
        color: this.winnerPlayer?.color
      };
    }

    return undefined;
  }

  get boardId() {
    return this.match.board.id;
  }
}
