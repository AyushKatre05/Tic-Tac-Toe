import React from 'react';
import Board from './Board';
import pic from './assets/bg.png'

const App: React.FC = () => {
  return (
    <div className="container mx-auto mt-10 flex flex-col items-center justify-center">
      <img className='h-48 w-96' src={pic} alt="" />
      <Board />
    </div>
  );
};

export default App;
