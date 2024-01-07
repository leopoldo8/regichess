import React from 'react';

import { Container, Title } from './style';

export default function GameoverOverlay({ isVisible, winnerName }: { isVisible: boolean; winnerName: string; }) {
  return (
    <Container isVisible={isVisible}>
      <Title>{winnerName} has win the game!</Title>
    </Container>
  )
}
