import React from 'react';

const categories = ['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đã hủy', 'Đã hoàn thành'];

const OrderTags = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="scroll-container overflow-x-auto whitespace-nowrap">
      <div className="flex gap-2 mb-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`text-sm px-7 py-2 rounded-2xl relative ${
              selectedCategory === category ? 'text-blue-500' : 'text-gray-700'
            } hover:text-blue-500`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
            {/* Line under the selected button */}
            {selectedCategory === category && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderTags;
