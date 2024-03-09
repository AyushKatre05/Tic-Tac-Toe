import React, { useState, useEffect } from 'react';
import Square from './Square';

interface BoardProps {}

const Board: React.FC<BoardProps> = () => {
  const [boardSize, setBoardSize] = useState<number>(3);
  const [board, setBoard] = useState<string[]>(Array(boardSize * boardSize).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O' | ''>('X');
  const [movesHistory, setMovesHistory] = useState<number[][]>([]);
  const [hintsEnabled, setHintsEnabled] = useState<boolean>(true);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [playWithComputer, setPlayWithComputer] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    setBoard(Array(boardSize * boardSize).fill(''));
    setCurrentPlayer('X');
    setMovesHistory([]);
    setWinner(null);
    setGameOver(false);
    if (playWithComputer && currentPlayer === 'O') {
      handleComputerMove();
    }
  }, [boardSize, playWithComputer]);
  
  useEffect(() => {
    const winner = checkWinner();
    if (winner) {
      setWinner(winner);
      setGameOver(true);
      setShowModal(true);
    } else if (playWithComputer && currentPlayer === 'O') {
      handleComputerMove();
    }
  }, [board, currentPlayer, playWithComputer]);

  const handleMove = (index: number) => {
    if (!gameOver && board[index] === '') {
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);
      setMovesHistory([...movesHistory, [index, currentPlayer === 'X' ? 1 : -1]]);
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      
    }
  };
  

  const undoMove = () => {
    if (movesHistory.length > 0 && !gameOver) {
      const [index, _] = movesHistory.pop()!;
      const newBoard = [...board];
      newBoard[index] = '';
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const generateWinningPatterns = (size: number): number[][] => {
    const patterns: number[][] = [];

    // Horizontal
    for (let i = 0; i < size * size; i += size) {
      patterns.push(Array.from({ length: size }, (_, index) => i + index));
    }

    // Vertical
    for (let i = 0; i < size; i++) {
      patterns.push(Array.from({ length: size }, (_, index) => i + index * size));
    }

    // Diagonal
    patterns.push(Array.from({ length: size }, (_, index) => index * (size + 1))); // Main diagonal
    patterns.push(Array.from({ length: size }, (_, index) => (index + 1) * (size - 1))); // Anti-diagonal

    return patterns;
  };

  const checkWinner = (currentBoard?: string[]): string | null => {
    const patterns = generateWinningPatterns(boardSize);
    const checkedBoard = currentBoard || board;
  
    for (const pattern of patterns) {
      const symbolsInPattern = pattern.map(index => checkedBoard[index]);
      const firstSymbol = symbolsInPattern[0];
      if (firstSymbol && symbolsInPattern.every(symbol => symbol === firstSymbol)) {
        return firstSymbol;
      }
    }
  
    if (!checkedBoard.includes('')) {
      return 'Draw';
    }
    return null;
  };
  
  const handleComputerMove = () => {
    if (!gameOver) {
      let index = Math.floor(Math.random() * board.length);
      while (board[index] !== '') {
        index = Math.floor(Math.random() * board.length);
      }
      handleMove(index);
    }
  };
  

  const renderHints = (): JSX.Element[] => {
    const hints: JSX.Element[] = [];
    if (hintsEnabled && !playWithComputer) {
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          const newBoard = [...board];
          newBoard[i] = currentPlayer;
          const winner = checkWinner(newBoard);
          if (winner === currentPlayer) {
            hints.push(
              <div key={i} className="text-green-500">
                <p>If you place {currentPlayer === 'X' ? 'X' : 'O'} at position {i + 1}, you'll win!</p>
              </div>
            );
          }
        }
      }
    }
    return hints;
  };

  const changeBoardSize = (size: number) => {
    setBoardSize(size);
  };

  const togglePlayWithComputer = () => {
    setPlayWithComputer(!playWithComputer);
  };

  const playAgain = () => {
    window.location.reload();
  };

  const squares = Array.from({ length: boardSize * boardSize }, (_, index) => (
    <Square key={index} value={board[index]} onClick={() => handleMove(index)} />
  ));

  const boardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
    gap: '10px',
    maxWidth: '90vw',
    margin: 'auto',
    backgroundColor: '#ddd',
    padding: '10px',
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <div style={boardStyle} className="mb-4">
        {squares}
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-2xl mb-4">{winner === 'Draw' ? "It's a draw!" : `${winner} wins!`}</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={playAgain}>Play Again</button>
          </div>
        </div>
      )}
      <div className="mb-4">
        <button onClick={undoMove} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Undo Move</button>
        {!playWithComputer && ( // Render the hint button only if not playing with computer
          <label>
            <input type="checkbox" checked={hintsEnabled} onChange={() => setHintsEnabled(!hintsEnabled)} />
            Show Hints
          </label>
        )}
      </div>
      <div className="mb-4">
        <label className="mr-2">Board Size:</label>
        <select onChange={(e) => changeBoardSize(parseInt(e.target.value))} className="border border-gray-400 rounded px-2 py-1">
          <option value="3">3x3</option>
          <option value="4">4x4</option>
          <option value="5">5x5</option>
        </select>
      </div>
      {renderHints()}
      {!playWithComputer && (
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input type="checkbox" checked={playWithComputer} onChange={togglePlayWithComputer} className="form-checkbox h-5 w-5 text-blue-600" />
            <span className="ml-2 text-gray-700">Play with Computer</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default Board;
