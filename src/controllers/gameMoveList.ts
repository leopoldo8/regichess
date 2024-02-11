import Match from "../entities/chess/match";
import Observer from "../utils/observer";
import UIController from "./UIController";

class GameMoveListController extends UIController {
  constructor(
    private readonly match: Match,
  ) {
    super();
  }

  getCurrentMatchMoveList() {
    return this.match.historicMovements;
  }

  registerObservable(callback: () => void) {
    const boardSubscription = this.match.board.register(new Observer('*', callback));

    return {
      boardSubscription,
    };
  }
}

export default GameMoveListController;
