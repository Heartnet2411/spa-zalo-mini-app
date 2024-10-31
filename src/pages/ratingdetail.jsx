import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { Button, Page, Text, Icon, Input } from 'zmp-ui';
import Header from '../components/header';
import { rateProduct } from '../services/rating.service';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';

const RatingDetailPage = () => {
  const { state } = useLocation();
  const { product, order } = state || {}; // Lấy product và orderID từ state
  const { userInfo: user, accessToken } = useRecoilValue(userState);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (event) => {
    setImages([...event.target.files]); // Lưu trữ hình ảnh từ input
  };

  console.log("product", product._id)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await rateProduct({
        userId: user.id,
        productID: product._id,
        orderID: order._id,
        rating,
        comment,
        images,
        accessToken,
      });

      console.log('Rating submitted successfully:', result);
      // Xử lý sau khi gửi đánh giá thành công (ví dụ: thông báo cho người dùng)
    } catch (error) {
      console.error('Error submitting rating:', error);
      setErrorMessage('Failed to submit rating. Please try again.');
    }
  };

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
      <Header />
      <div className="p-4 mt-14 mb-14">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="bg-white p-4 w-full mb-4">
            <div className="flex items-center flex-row border-b-2 pb-2">
              <img
                src={product.image}
                alt={product.productName}
                className="h-12 object-cover rounded-md mb-2"
              />
              <div className="flex flex-col ml-2">
                <span className="text-base mb-1">{product.productName}</span>
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
          <input type="file" multiple onChange={handleImageChange} className="hidden" />
          <div className="bg-gray-50 rounded-lg border w-full mb-5">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2 bg-gray-50 resize-none w-full"
              placeholder="Hãy chia sẻ nhận xét cho sản phẩm này bạn nhé!"
              rows={5}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="w-20 h-10 bg-orange-400"
              onClick={handleSubmit}
            >
              <span className="text-white">Gửi</span>
            </button>
          </div>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
      </div>
    </Page>
  );
};

export default RatingDetailPage;
