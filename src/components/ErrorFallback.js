import React from 'react';

const ErrorFallback = ({ error }) => (
  <div role="alert">
    <h2>Oops! Une erreur s'est produite</h2>
    <p>Message d'erreur: {error.message}</p>
  </div>
);

export default ErrorFallback;