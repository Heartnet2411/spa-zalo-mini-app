import React, { useState, useEffect } from 'react';
import { getAllCategory } from '../services/service.service';
import { useNavigate } from 'react-router-dom';

import hair from '../assets/img/hair.png';
import eye from '../assets/img/eye.png';
import face from '../assets/img/face.jpg';
import lip from '../assets/img/lip.png';
import skin from '../assets/img/skin.png';

const images = [hair, eye, face, lip, skin]; // Mảng chứa các hình ảnh

const FilterTags = () => {
  const navigate = useNavigate();
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

        setSubCategories([...allSubCategories]);
        console.log(allSubCategories);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectCategory = (category) => {
    navigate(`/shop?category=${category.id}&categoryName=${category.name}`);
  };

  // Hàm để chọn hình ảnh ngẫu nhiên
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  return (
    <div className="scroll-container overflow-x-auto whitespace-nowrap">
      <div className="flex gap-4 justify-around ">
        {subCategories.map((category) => (
          <div key={category.name} className="flex flex-col items-center">
            <button
              className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center border-2 border-gray-200 hover:border-blue-400"
              onClick={() => handleSelectCategory(category)} // Gọi hàm khi chọn
            >
              <img
                src={getRandomImage()} // Lấy hình ảnh ngẫu nhiên
                alt={category.name}
                className="object-cover w-full h-full"
              />
            </button>
            <p className="text-base mt-1 text-center text-gray-700  w-20 whitespace-normal overflow-wrap line-clamp-2">
              {category.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterTags;
