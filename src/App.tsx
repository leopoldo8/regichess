import './App.css';
import Chessboard from './components/Chessboard';

import CaptureTheKingGameRules from './entities/chess/rules/default';
import Match from './entities/chess/match';
import Board from './entities/chess/board';
import Guest from './entities/user/guest';

import MatchControllersAdapter from './adapters/match/MatchControllersAdapter';

import { mainBoardId } from './constants/board';
import defaultPieceArrange from './constants/pieceMaps/default';

import { GameNetwork } from './models';

const board = new Board(
  mainBoardId,
  defaultPieceArrange
);

const user1 = new Guest(Math.random().toString(), { name: 'Player 1' });
const user2 = new Guest(Math.random().toString(), { name: 'Player 2' });

const match = new Match(
  new CaptureTheKingGameRules(),
  GameNetwork.local,
  board,
  [user1, user2]
);

const matchController = new MatchControllersAdapter(match);

function App() {
  return (
    <div className="App">
      <h1>Chess but you actually have to capture the king</h1>
      <Chessboard matchController={matchController} />
    </div>
  )
}

export default App;
