import React, { useState, useEffect } from 'react';
import { getAllCategory } from '../services/service.service';

// const categories = ['Tất cả', 'Mặt', 'Mắt', 'Môi', 'Tóc', 'Da'];

const FilterTags = ({ selectedCategory, onSelectCategory, fetchProducts }) => {
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategory();
      if (data) {
        const allSubCategories = data.reduce((acc, category) => {
          return [
            ...acc,
            ...category.subCategory.map((sub) => ({
              name: sub.name,
              id: sub._id,
            })),
          ];
        }, []);

        setSubCategories([{ name: 'Tất cả', id: null }, ...allSubCategories]);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectCategory = (category) => {
    onSelectCategory(category.name);
    fetchProducts(1, category.id); // Gọi hàm fetchProducts và truyền vào subcategoryId
  };

  return (
    <div className="scroll-container overflow-x-auto whitespace-nowrap">
      <div className="flex gap-2 mb-2">
        {subCategories.map((category) => (
          <button
            key={category.id || 'all'}
            className={`text-base px-5 py-2 rounded-2xl font-medium  ${
              selectedCategory === category.name
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } hover:bg-blue-500`}
            onClick={() => handleSelectCategory(category)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterTags;
