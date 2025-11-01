import React from 'react';

const Input = ({label, placeholder, disabled }) => {
  return (
    <div className="flex flex-col gap-1  ">
      <label htmlFor="text-gray-700 font-semibold">{label}</label>
      <input type="text" placeholder={placeholder} disabled={disabled}
      className='rounded-4xl border-amber-700 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-300 p-2 w-full'
       
      />
    </div>
  );
};

export default Input;
