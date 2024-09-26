import React from 'react';
import { Button, Page, Text, useNavigate } from 'zmp-ui';
import { products } from '../utils/productdemo';

const RatingPage = () => {
  const navigate = useNavigate();

  // Chọn 2 sản phẩm để hiển thị
  const selectedProducts = [products[0], products[4]];

  return (
    <Page className="page">
      <div className="flex flex-col items-center justify-center w-full">
        {selectedProducts.map((product, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md w-full mb-4">
            <div className="flex items-center flex-row">
              <img
                src={product.image}
                alt={product.name}
                className="h-24 object-cover rounded-md mb-2"
              />
              <Text className="text-base mb-1">{product.name}</Text>
            </div>
            <div className="flex justify-end">
              <button
                className="w-20 h-10 bg-orange-400"
                onClick={() => navigate(`/ratingdetail`)}
              >
                <span className="text-white">Đánh giá</span>
              </button>
            </div>
          </div>
        ))}
        <span className="text-red-500">Không còn đánh giá nào</span>
      </div>
    </Page>
  );
};

export default RatingPage;
