import React from 'react';
import Board from './Board';

const App: React.FC = () => {
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-center text-3xl font-bold mb-5">Tic Tac Toe</h1>
      <Board />
    </div>
  );
};

export default App;
