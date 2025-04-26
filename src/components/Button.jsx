import React from 'react'

const Button = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick} // Pastikan event diteruskan dengan benar
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;