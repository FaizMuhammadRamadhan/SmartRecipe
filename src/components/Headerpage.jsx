import React from "react";

export default function Headerpage({children, children2, className}) {
  return (
    <div>
      <h1 className={`text-4xl ${className} font-extrabold text-center text-[#2E5077] mb-6`}>
         {children}
      </h1>
      <p className={`text-center ${className} text-gray-500 mb-8`}>
         {children2}
      </p>
    </div>
  );
}
