import { useLocation } from 'react-router-dom'; 
import React, { useState } from 'react';
import { Button, Page, Text, Icon, Input } from 'zmp-ui';
import Header from '../components/header';
import { rateProduct } from '../services/rating.service'; // Import service đã tạo
import { useRecoilValue } from 'recoil';
import { userState } from '../state';

const RatingDetailPage = () => {
  const { state } = useLocation();
  const { product } = state || {};
  const { accessToken } = useRecoilValue(userState);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [orderID, setOrderID] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (event) => {
    setImages([...event.target.files]); // Lưu trữ hình ảnh từ input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    
      const result = await rateProduct({
        userId,
        productID: product._id,
        orderID:
        rating,
        comment,
        images,
        accessToken,
      });

      console.log('Rating submitted successfully:', result);
      // Xử lý sau khi gửi đánh giá thành công (như thông báo cho người dùng)
    } catch (error) {
      console.error('Error submitting rating:', error);
      setErrorMessage('Failed to submit rating. Please try again.');
    }
  };

  return (
    <Page className="page">
      <Header />
      <div className="p-4 mt-14 mb-14">
        {/* Hiển thị chi tiết sản phẩm và form đánh giá */}
        <div className="bg-white p-4 w-full mb-4">
          <div className="flex items-center flex-row border-b-2 pb-2">
            <img
              src={product.image || "placeholder.jpg"}
              alt={product.productName}
              className="h-12 object-cover rounded-md mb-2"
            />
            <div className="flex flex-col ml-2">
              <span className="text-base mb-1">{product.productName}</span>
              <span className="text-sm mb-1">Phân loại: {product.category}</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <Input 
                type="number" 
                placeholder="Rating (1-5)" 
                value={rating} 
                onChange={(e) => setRating(Number(e.target.value))}
                min="1" 
                max="5" 
              />
            </div>
            <div className="mb-4">
              <Input 
                type="text" 
                placeholder="Your comment" 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
              />
            </div>
            <div className="mb-4">
              <input type="file" multiple onChange={handleImageChange} />
            </div>
            <div className="mb-4">
              <Input 
                type="text" 
                placeholder="Order ID" 
                value={orderID} 
                onChange={(e) => setOrderID(e.target.value)} 
              />
            </div>
            <Button type="submit">Submit Rating</Button>
            {errorMessage && <Text color="red">{errorMessage}</Text>}
          </form>
        </div>
      </div>
    </Page>
  );
};

export default RatingDetailPage;
