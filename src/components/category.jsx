import React from 'react';
import hair from '../assets/img/hair.png';
import eye from '../assets/img/eye.png';
import face from '../assets/img/face.jpg';
import lip from '../assets/img/lip.png';
import skin from '../assets/img/skin.png';

const categories = [
  { name: 'Mặt', image: face },
  { name: 'Mắt', image: eye },
  { name: 'Môi', image: lip },
  { name: 'Tóc', image: hair },
  { name: 'Da', image: skin },
];

const FilterTags = () => {
  return (
    <div className="scroll-container overflow-x-auto whitespace-nowrap">
      <div className="flex gap-4 justify-around">
        {categories.map((category) => (
          <div key={category.name} className="flex flex-col items-center ">
            <button className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center border-2 border-gray-200 hover:border-blue-400">
              <img
                src={category.image}
                alt={category.name}
                className="object-cover w-full h-full"
              />
            </button>
            <span className="text-base mt-1 text-center text-gray-700">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterTags;
