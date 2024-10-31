import React from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating }) => {
  const isWholeNumber = Number.isInteger(rating);
  const fullStars = isWholeNumber ? rating : Math.floor(rating);
  const halfStars = !isWholeNumber ? 1 : 0;

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          return <FaStar key={index} className="text-yellow-400" />;
        }
        if (index === fullStars && halfStars) {
          return (
            <FaStar
              key={index}
              className="text-yellow-500"
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          );
        }
        return <FaStar key={index} className="text-gray-300" />;
      })}
    </div>
  );
};

export default StarRating;
