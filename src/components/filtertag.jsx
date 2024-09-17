import React from 'react';

const categories = ['Tất cả', 'Mặt', 'Mắt', 'Môi', 'Tóc', 'Da'];

const FilterTags = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="scroll-container overflow-x-auto whitespace-nowrap ">
      <div className="flex gap-2 mb-1">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-400`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterTags;
