import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { Button, Page, Text, Icon, Input, Modal, useNavigate } from 'zmp-ui';
import Header from '../components/header';
import { rateProduct } from '../services/rating.service'; // Import service đã tạo
import { useRecoilValue } from 'recoil';
import { userState } from '../state';
import StarRating from '../components/star-rating';
import StarRatings from 'react-star-ratings';

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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    console.log('Submit button clicked');
    e.preventDefault();
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    setModalVisible(false); // Đóng modal
    navigate('/order-status'); // Chuyển hướng về trang order-status
  };

  return (
    <Page className="page">
      <Header />
      <div className="p-4 mt-8 mb-14">
        {/* Hiển thị chi tiết sản phẩm và form đánh giá */}
        <div className="bg-white p-4 w-full mb-4">
          <div className="flex items-center flex-row border-b-2 pb-2">
            <img
              src={product.images[0] || 'placeholder.jpg'}
              alt={product.productName}
              className="h-24 object-cover rounded-md mb-2"
            />
            <div className="flex flex-col ml-2">
              <span className="text-lg text-bold mb-1">{product.productName}</span>
              <span className="text-sm mb-1">Phân loại: {product.volume}</span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-4"
            enctype="multipart/form-data"
          >
            <div className="mb-6">
              <div className="flex flex-row justify-center gap-2">
                <StarRatings
                  className="w-50"
                  rating={rating}
                  starRatedColor="rgb(255,215,0)"
                  starHoverColor="rgb(255,215,0)"
                  changeRating={(newRating) => setRating(newRating)}
                  numberOfStars={5}
                  name='rating'
                  starDimension="35px"
                  starSpacing="8px"
                />
              </div>
            </div>
            <div className="mb-6">
              <div>
                <span className="font-semibold">Viết đánh giá</span>
                <Input.TextArea
                  type="text"
                  placeholder="Hãy chia sẻ cảm nhận của bạn!"
                  value={comment}
                  multiline
                  onChange={(e) => setComment(e.target.value)}
                  showCount
                  maxLength={200}
                />
              </div>
            </div>
            <div className="mb-6">
              <div className="flex flex-row gap-2 overflow-x-auto flex-nowrap mb-4">
                {images.map((file, index) => (
                  <img key={index} src={URL.createObjectURL(file)} alt={`Uploaded ${index + 1}`} className="w-24 h-24 object-cover rounded-md border border-gray-300" />
                ))}
              </div>
              <div className="flex items-center justify-center w-full">
                <label for="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  </div>
                  <input
                    id="dropzone-file"
                    className="hidden"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>

              </div>
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
          <div className="flex flex-col justify-center items-center gap-6">
            <Icon
              icon="zi-check-circle"
              className="bg-green-500 rounded-full text-white"
              size={80}
            ></Icon>
            <span className="text-xl font-semibold text-center">Đánh giá của bạn đã được gửi thành công!</span>

            <Button onClick={handleConfirm}>Xác nhận</Button>
          </div>
        </Modal>

        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div role="status">
              <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};

export default RatingDetailPage;
