import React from "react";

interface SquareProps {
  value: string;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ value, onClick }) => {
  return (
    <button
      className="text-3xl text-white font-extrabold bg-green-900
    h-12 w-12 lg:w-24 lg:h-24 md:w-20 md:h-20 cursor-pointer"
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Square;
