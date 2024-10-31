import React from 'react';
import { Button, Page, Text, useNavigate } from 'zmp-ui';
import { useLocation } from 'react-router-dom';
import Header from '../components/header';

const RatingPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { order } = state || {};

  return (
    <Page className="page">
      <Header />
      <div className="p-4 mt-14 mb-14">
        <div className="flex flex-col items-center justify-center w-full">
          {order?.products.map((product, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md w-full mb-4"
            >
              <div className="flex items-center flex-row">
                <img
                  src={product.image || 'placeholder.jpg'}
                  alt={product.productName}
                  className="h-24 object-cover rounded-md mb-2"
                />
                <Text className="text-base mb-1">{product.productName}</Text>
              </div>
              <div className="flex justify-end">
                <button
                  className="w-20 h-10 bg-orange-400"
                  onClick={() =>
                    navigate(`/ratingdetail`, { state: { product } })
                  }
                >
                  <span className="text-white">Đánh giá</span>
                </button>
              </div>
            </div>
          ))}
          <span className="text-red-500">Không còn đánh giá nào</span>
        </div>
      </div>
    </Page>
  );
};

export default RatingPage;
