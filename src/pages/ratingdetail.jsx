import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { Button, Page, Text, Icon, Input, Modal, useNavigate } from 'zmp-ui';
import Header from '../components/header';
import { rateProduct } from '../services/rating.service'; // Import service đã tạo
import { useRecoilValue } from 'recoil';
import { userState } from '../state';

const RatingDetailPage = () => {
  const { state } = useLocation();
  const { order, product } = state || {};
  const { accessToken } = useRecoilValue(userState);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { userInfo: user } = useRecoilValue(userState);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    setImages([...event.target.files]); // Lưu trữ hình ảnh từ input
  };

  const handleSubmit = async (e) => {
    console.log('Submit button clicked');
    e.preventDefault();
    try {
      const result = await rateProduct({
        userId: user.id,
        productID: product.productId,
        orderID: order._id,
        variantID: product.variantId,
        volume: product.volume,
        rating,
        comment,
        images,
        accessToken,
      });

      if (result) {
        setModalVisible(true);
      }
      // Xử lý sau khi gửi đánh giá thành công (như thông báo cho người dùng)
    } catch (error) {
      console.error('Error submitting rating:', error);
      setErrorMessage('Failed to submit rating. Please try again.');
    }
  };

  const handleConfirm = () => {
    setModalVisible(false); // Đóng modal
    navigate('/order-status'); // Chuyển hướng về trang order-status
  };

  return (
    <Page className="page">
      <Header />
      <div className="p-4 mt-14 mb-14">
        {/* Hiển thị chi tiết sản phẩm và form đánh giá */}
        <div className="bg-white p-4 w-full mb-4">
          <div className="flex items-center flex-row border-b-2 pb-2">
            <img
              src={product.images[0] || 'placeholder.jpg'}
              alt={product.productName}
              className="h-12 object-cover rounded-md mb-2"
            />
            <div className="flex flex-col ml-2">
              <span className="text-base mb-1">{product.productName}</span>
              <span className="text-sm mb-1">Phân loại: {product.volume}</span>
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
                placeholder="Đánh giá của bạn"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <input type="file" multiple onChange={handleImageChange} />
            </div>
            <div className="flex items-center justify-center w-full">
              <button
                type="submit"
                className="px-4 py-2 border bg-orange-500 rounded-lg text-white"
              >
                Gửi đánh giá
              </button>
            </div>
            {errorMessage && <Text color="red">{errorMessage}</Text>}
          </form>
        </div>

        {/* Modal thông báo thành công */}
        <Modal
          visible={modalVisible}
          onClose={() => setModalVisible(false)} // Đóng modal khi nhấn bên ngoài
        >
          <div className="p-4">
            <Text>Đánh giá của bạn đã được gửi thành công!</Text>
            <Button onClick={handleConfirm}>Xác nhận</Button>
          </div>
        </Modal>
      </div>
    </Page>
  );
};

export default RatingDetailPage;
