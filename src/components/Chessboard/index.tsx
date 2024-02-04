import { useEffect, useState } from "react";
import { ColumnsNames, RowsNames } from "../../constants/board";

import MatchControllersAdapter from "../../adapters/match/MatchControllersAdapter";

import ChessBoardController from "../../controllers/chessboard";

import Piece from "../Piece";

import { Table, TableHeader, TableCell } from './style';
import GameoverOverlay from "../GameoverOverlay";

type Props = { matchController: MatchControllersAdapter };
type InnerProps = { matchController: MatchControllersAdapter; chessBoardController: ChessBoardController };

const rowNames = RowsNames.reverse();

const Cells = ({ matchController, chessBoardController, row }: InnerProps & { row: number; }) => (
  <>
    {
      Array(8).fill(0).map((v, index) => {
        const pieceController = matchController.instantiatePieceController(row, index);
        const squareUIData = chessBoardController.getOrCreateCellUIData(row, index);

        const onSquareClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          if (e.target !== e.currentTarget) return;
          
          chessBoardController.onBoardClick(row, index);
        }

        return (
          <TableCell
            data-column={index}
            key={`${ColumnsNames[index]}-${index}`}
            preview={squareUIData.displayPossibleMovementIndicator}
            onClick={(e) => onSquareClick(e)}
          >
            {pieceController && <Piece PieceController={pieceController} />}
            <p style={{ position: 'absolute', top: 0, left: 0, fontSize: '0.5rem', color: 'black' }}>
              x: {row}
              y: {index}
            </p>
          </TableCell>
        );
      })
    }
  </>
);

const Rows = (props: InnerProps) => (
  <>
    {
      Array(8).fill(0).map((v, index) => (
        <tr data-row={index} key={RowsNames[index]}>
          <TableHeader>{ rowNames[index] }</TableHeader>
          <Cells {...props} row={index} />
        </tr>
      ))
    }
  </>
);

const RenderColumnsNames = () => (
  <tr style={{ pointerEvents: 'none', userSelect: 'none' }}>
    <TableHeader />
    {
      ColumnsNames.map((name) => (
        <TableHeader key={name}>{ name }</TableHeader>
      ))
    }
  </tr>
);

const Chessboard = ({ matchController }: Props) => {
  const chessBoardController = matchController.instantiateChessBoardController();

  const { name: PlayerName, color: PlayerColor } = matchController.getCurrentPlayerInfo();
  const winner = chessBoardController.getMatchWinner();

  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const subscription = chessBoardController.registerObservable(() => {
      setRenderKey(v => v + 1);
    });

    return () => {
      subscription.boardSubscription.remove();
      subscription.boardUISubscription.remove();
    }
  }, []);

  return (
    <div>
      <div id="main-board" style={{ position: 'relative' }}>
        <div className="gameover-overlay">
          <GameoverOverlay
            isVisible={!!winner}
            winnerName={`${winner?.name} (${winner?.color})`}
          />
        </div>
        <div>
          <Table
            id={chessBoardController.boardId}
            className="chess-board"
            key={renderKey}
          >
            <tbody>
              <Rows
                matchController={matchController}
                chessBoardController={chessBoardController}
              />
              <RenderColumnsNames />
            </tbody>
          </Table>
          <div className="general-overlay"></div>
        </div>
      </div>
      <p><span style={{ textTransform: 'uppercase' }}>{PlayerColor}</span> ({PlayerName}) to move</p>
    </div>
  );
}


export default Chessboard;
