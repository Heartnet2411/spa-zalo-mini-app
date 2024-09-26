import React, { useState } from 'react';
import { Button, Page, Text, useNavigate, Icon, Input } from 'zmp-ui';
import { products } from '../utils/productdemo';

const RatingDetailPage = () => {
  const navigate = useNavigate();
  const product = products[0];

  // State to manage the rating
  const [rating, setRating] = useState(0);

  // Function to render stars based on the rating
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        icon="zi-star"
        className={`text-lg ${index < rating ? 'text-orange-500' : 'text-gray-300'} cursor-pointer`}
        onClick={() => setRating(index + 1)}
      />
    ));
  };

  return (
    <Page className="page">
      <div className="flex flex-col items-center justify-center w-full">
        <div className="bg-white p-4 w-full mb-4">
          <div className="flex items-center flex-row border-b-2 pb-2">
            <img
              src={product.image}
              alt={product.name}
              className="h-12 object-cover rounded-md mb-2"
            />
            <div className="flex flex-col ml-2">
              <span className="text-base mb-1">{product.name}</span>
              <span className="text-sm mb-1">Phân loại: Kem</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex-1">
            <span className="text-base">Chất lượng sản phẩm</span>
          </div>
          <div className="flex justify-center flex-1">{renderStars()}</div>
          <div className="flex-1 text-right">
            <span className="text-base">
              {rating === 1
                ? 'Tệ'
                : rating === 2
                  ? 'Không hài lòng'
                  : rating === 3
                    ? 'Bình thường'
                    : rating === 4
                      ? 'Hài lòng'
                      : rating === 5
                        ? 'Tuyệt vời'
                        : ''}
            </span>
          </div>
        </div>
        <div className="flex flex-row space-x-2 mb-5">
          <button className="w-44 rounded-lg border border-orange-500 mt-5 flex flex-col items-center justify-center p-1 ">
            <Icon icon="zi-camera" className="text-orange-500" />
            <span className="text-orange-500">Thêm hình ảnh</span>
          </button>

          <button className="w-44 rounded-lg border border-orange-500 mt-5 flex flex-col items-center justify-center">
            <Icon icon="zi-video" className="text-orange-500" />
            <span className="text-orange-500">Thêm video</span>
          </button>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg border w-11/12 mb-5">
          <div className="border-b-2">
            <div className="flex items-center">
              <span className="text-base">Chất lượng sản phẩm:</span>
              <textarea
                className="m-2 bg-gray-50 resize-none"
                placeholder=" để lại đánh giá"
                rows={1}
              ></textarea>
            </div>
            <div className="flex items-center">
              <span className="text-base ">Đúng với mô tả:</span>
              <textarea
                className="m-2 bg-gray-50 resize-none"
                rows={1}
              ></textarea>
            </div>
          </div>
          <textarea
            className="mt-2 bg-gray-50 resize-none w-full"
            placeholder="Hãy chia sẻ nhận xét cho sản phẩm này bạn nhé!"
            rows={5}
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            className="w-20 h-10 bg-orange-400"
            onClick={() => navigate(``)}
          >
            <span className="text-white">Gửi</span>
          </button>
        </div>
      </div>
    </Page>
  );
};

export default RatingDetailPage;
