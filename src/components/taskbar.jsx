import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GoHomeFill } from 'react-icons/go';
import { FaRegCalendarCheck } from 'react-icons/fa6';
import { FaCartShopping, FaGamepad } from 'react-icons/fa6';
import { IoPersonSharp } from 'react-icons/io5';

const Taskbar = () => {
  const location = useLocation();
  const hideTaskbar =
    location.pathname.startsWith('/product/') ||
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/payment');
  if (hideTaskbar) {
    return null; // Không hiển thị Taskbar
  }

  // Function to determine active status
  const getActiveClass = (path) =>
    location.pathname === path ? 'text-blue-500' : 'text-gray-700';

  return (
    <div className="fixed bottom-0 w-full bg-white shadow-lg py-2 flex justify-around border-t border-gray-400">
      <Link
        to="/"
        className={`text-base taskbar-button text-center w-full flex flex-col items-center ${getActiveClass(
          '/'
        )}`}
      >
        <GoHomeFill size={20} />
        <span>Trang chủ</span>
      </Link>
      <Link
        to="/booking"
        className={`text-base taskbar-button text-center w-full flex flex-col items-center ${getActiveClass(
          '/booking'
        )}`}
      >
        <FaRegCalendarCheck size={20} />
        <span>Đặt lịch</span>
      </Link>
      <Link
        to="/shop"
        className={`text-base taskbar-button text-center w-full flex flex-col items-center ${getActiveClass(
          '/shop'
        )}`}
      >
        <FaCartShopping size={20} />
        <span>Mua hàng</span>
      </Link>
      <Link
        to="/game"
        className={`text-base taskbar-button text-center w-full flex flex-col items-center ${getActiveClass(
          '/game'
        )}`}
      >
        <FaGamepad size={20} />
        <span>Game</span>
      </Link>
      <Link
        to="/profile"
        className={`text-base taskbar-button text-center w-full flex flex-col items-center ${getActiveClass(
          '/profile'
        )}`}
      >
        <IoPersonSharp size={20} />
        <span>Cá nhân</span>
      </Link>
    </div>
  );
};

export default Taskbar;
