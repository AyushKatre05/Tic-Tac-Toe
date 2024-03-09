import React from "react";

interface SquareProps {
  value: string;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ value, onClick }) => {
  return (
    <button
      className="text-3xl font-extrabold 
    border-black 
    bg-slate-200
    h-12 w-12 lg:w-24 lg:h-24 md:w-18 md:w-18 cursor-pointer"
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Square;
