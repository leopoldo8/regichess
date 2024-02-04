import { createRoot } from "react-dom/client";
import Position from "../../entities/2d/position";
import Board from "../../entities/chess/board";
import PromoteSelection from "../../components/PromoteSelection";
import { PieceType, TGenericPieceColor } from "../../models";
import Observable from "../../utils/observable";

type Props = {
  board: Board,
  color: TGenericPieceColor,
  position: Position,
}

export type PromotionSelectedEvent = {
  type?: PieceType,
} 

class CommonRulesUIAdapter extends Observable {
  showPromoteSelectionDialog({ board, color, position }: Props) {
    const root = createRoot(document.querySelector(`#${board.id} ~ .general-overlay`)!);
    
    const bounds = this.getBoundsFromPosition(board.id, position);

    root.render(PromoteSelection({
      color,
      top: bounds?.top ? bounds.top - 130 : undefined,
      left: bounds?.left ? bounds.left - 24 : undefined,
      onResult: this.onSelectionResult.bind(this)
    }));
  }

  onSelectionResult(type?: PieceType) {
    document.getElementById('promotion-selection')?.remove();

    this.notify<PromotionSelectedEvent>('promotionSelected', { type });
  }

  private getBoundsFromPosition(boardId: string, position: Position) {
    const board = document.getElementById(boardId);
    const cell = board?.querySelector(`tr[data-row="${position.x}"] td[data-column="${position.y}"]`);

    return cell?.getBoundingClientRect();
  }
}

export default CommonRulesUIAdapter;
