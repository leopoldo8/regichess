import React from 'react';
import MatchControllersAdapter from '../../adapters/match/MatchControllersAdapter';
import useControllerHook from '../../utils/useControllerHook';
import { Container } from './style';

type Props = { matchController: MatchControllersAdapter };

export default function GameMoveList({ matchController }: Props) {
  const gameMoveListController = matchController.instantiateGameMoveListController();

  const { renderKey } = useControllerHook(gameMoveListController);

  return (
    <Container key={renderKey}>
      {gameMoveListController.getCurrentMatchMoveList().map((move, index) => (
        <p key={index}>{`${move.piece.color} ${move.piece.type} ${move.isTakingPiece ? 'takes' : 'to'} ${move.to?.x},${move.to?.y}`}</p>
      ))}
    </Container>
  )
}
