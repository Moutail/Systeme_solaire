import React from 'react';

function Instructions() {
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
    }}>
      <h3>Contrôles du vaisseau :</h3>
      <ul>
        <li>W/S : Avancer/Reculer</li>
        <li>A/D : Gauche/Droite</li>
        <li>Q/E : Monter/Descendre</li>
        <li>Shift : Accélérer</li>
      </ul>
    </div>
  );
}

export default Instructions;