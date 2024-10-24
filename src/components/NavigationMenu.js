import React from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 10px;
`;

const MenuButton = styled.button`
  background-color: ${props => props.color};
  color: white;
  border: none;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

function NavigationMenu({ planets, onPlanetClick }) {
  return (
    <MenuContainer>
      {planets.map(planet => (
        <MenuButton
          key={planet.title}
          color={planet.color}
          onClick={() => onPlanetClick(planet.title)}
        >
          {planet.title}
        </MenuButton>
      ))}
    </MenuContainer>
  );
}

export default NavigationMenu;