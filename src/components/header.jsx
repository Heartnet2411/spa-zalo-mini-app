import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5'; // Icon back arrow

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Function to get the title based on the current route
  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Trang chủ';
      case '/booking':
        return 'Đặt lịch';
      case '/bookingform':
        return 'Đặt lịch'
      case '/shop':
        return 'Mua hàng';
      case '/profile':
        return 'Thông tin cá nhân';
      case '/form':
        return 'Chỉnh sửa thông tin';
      case '/cart':
        return 'Giỏ hàng';
      case '/rating':
        return 'Đánh giá của tôi';
      case '/ratingdetail':
        return 'Đánh giá sản phẩm';
      default:
        return 'Spa Mini App'; // Default title if no specific route matches
    }
  };

  // Only show back button if the user is not on the homepage
  const showBackButton = location.pathname !== '/';

  return (
    <header className="fixed top-0 w-full bg-blue-600 text-white py-3 px-6 flex items-center shadow-md z-10">
      {showBackButton && (
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 text-white"
        >
          <IoArrowBack size={24} />
        </button>
      )}
      <h1 className="text-xl font-bold mx-auto">{getTitle()}</h1>
    </header>
  );
};

export default Header;
