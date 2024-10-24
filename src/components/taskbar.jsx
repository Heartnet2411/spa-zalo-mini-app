import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GoHomeFill } from 'react-icons/go';
import { FaRegCalendarCheck } from 'react-icons/fa6';
import { FaCartShopping, FaGamepad } from 'react-icons/fa6';
import { IoPersonSharp } from 'react-icons/io5';
import { fetchUserCart } from '../services/cart.service';
import { userState } from '../state';
import { useRecoilState } from 'recoil';

const Taskbar = () => {
  const [user, setUserState] = useRecoilState(userState);
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const hideTaskbar =
    location.pathname.startsWith('/product/') ||
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/payment');
  if (hideTaskbar) {
    return null; // Không hiển thị Taskbar
  }

  const getUserCart = async () => {
    const cart = await fetchUserCart(user.accessToken);
    if (cart) {
      console.log(cart.carts.length);
      setCartCount(cart.carts.length);
    } else {
      throw new Error('Failed to fetch cart data');
    }
  };

  useEffect(() => {
    //Cart được gọi
    getUserCart();
  }, []);

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
        className={`text-base relative taskbar-button text-center w-full flex flex-col items-center ${getActiveClass(
          '/shop'
        )}`}
      >
        <FaCartShopping size={20} />
        <span>Mua hàng</span>
        {cartCount > 0 ? (
          <span className="absolute -top-2 right-2  bg-red-500 border border-white box-border  px-2 py-0 leading-6 rounded-full text-white text-sm">
            {cartCount}
          </span>
        ) : null}
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
