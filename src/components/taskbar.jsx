import React from 'react';
import { Link } from 'react-router-dom';
import { GoHomeFill } from 'react-icons/go';
import { FaRegCalendarCheck } from 'react-icons/fa6';
import { FaCartShopping } from 'react-icons/fa6';
import { IoPersonSharp } from 'react-icons/io5';

const Taskbar = () => {
  return (
    <div className="fixed bottom-0 w-full bg-white shadow-lg py-2 flex justify-around border-t border-gray-400">
      <Link
        to="/"
        className="text-base taskbar-button text-center text-gray-700 hover:bg-gray-100 w-full flex flex-col items-center"
      >
        <GoHomeFill size={20} />
        <span>Trang chủ</span>
      </Link>
      <Link
        to="/booking"
        className="text-base taskbar-button text-center text-gray-700 hover:bg-gray-100 w-full flex flex-col items-center"
      >
        <FaRegCalendarCheck size={20} />
        <span>Đặt lịch</span>
      </Link>
      <Link
        to="/shop"
        className="text-base taskbar-button text-center text-gray-700 hover:bg-gray-100 w-full flex flex-col items-center"
      >
        <FaCartShopping size={20} />
        <span>Mua hàng</span>
      </Link>
      <Link
        to="/profile"
        className=" taskbar-button text-center text-gray-700 hover:bg-gray-100 w-full flex flex-col items-center"
      >
        <IoPersonSharp size={20} />
        <span>Cá nhân</span>
      </Link>
    </div>
  );
};

export default Taskbar;
