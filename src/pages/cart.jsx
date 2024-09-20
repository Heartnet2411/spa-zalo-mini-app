import React, { Suspense, useState, useRef } from 'react';
import { Button, Input, Box, Page, useSnackbar } from 'zmp-ui';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { IoBagCheckOutline } from 'react-icons/io5';
import { LiaTimesSolid } from 'react-icons/lia';
import anh1 from '../assets/img/example1.jpg';
import anh2 from '../assets/img/example2.jpg';

const cartItems = [
  {
    id: 1,
    name: 'Kem Dưỡng Mặt',
    price: 250000,
    quantity: 2,
    image: anh1,
  },
  {
    id: 2,
    name: 'Serum Mắt',
    price: 300000,
    quantity: 1,
    image: anh2,
  },
  {
    id: 3,
    name: 'Son Môi',
    price: 150000,
    quantity: 3,
    image: anh1,
  },
];

const CartPage = () => {
  const [cart, setCart] = useState(cartItems);

  const updateQuantity = (id, amount) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(0, item.quantity + amount),
            }
          : item
      )
    );
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Page className="page">
      <Suspense>
        <div className="p-4 h-screen">
          <div className="h-4/6 overflow-scroll scroll-container ">
            <h1 className="text-2xl font-bold mb-4 text-center">Giỏ Hàng</h1>
            {cart.map((item) => (
              <div
                key={item.id}
                className=" border rounded-lg p-4 bg-gray-100 mb-2  flex items-center justify-between"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-contain mr-4 bg-white rounded-lg"
                  />
                  <div style={{ width: 'calc(100vw - 13rem)' }} className="">
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <span className="my-4">30 ml</span>

                    <div>
                      <p className="font-bold text-lg">
                        {(item.price * item.quantity).toLocaleString()} VNĐ
                      </p>
                    </div>

                    <div className="flex justify-between w-full">
                      <div className="flex items-center border border-gray-500 p-1 px-3 rounded-lg mt-2">
                        <button
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <FiMinus size={24} />
                        </button>
                        <span className="text-lg font-bold px-4">
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.id, 1)}>
                          <FiPlus size={24} />
                        </button>
                      </div>
                      <button>
                        <LiaTimesSolid size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-2/6 pt-4 flex flex-col justify-end bg-white -mx-4">
            <div className="relative mb-2 mx-4">
              <input
                type="text"
                placeholder="Thêm mã giảm giá"
                className="px-4 py-4 border rounded-md w-full  focus:outline-blue-500"
              />

              <button
                size={18}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer bg-blue-500 px-6 py-2 rounded-md"
              >
                {' '}
                Add
              </button>
            </div>

            <div className="text-xl font-extrabold flex justify-between mx-4">
              <span className="text-lg font-medium">Giá</span>{' '}
              <span>{totalAmount.toLocaleString()} VNĐ</span>
            </div>

            <div className="text-xl font-extrabold flex justify-between mx-4">
              <span className="text-lg font-medium">Giảm giá</span>{' '}
              <span>0 VNĐ</span>
            </div>

            <div className="border-t-2 border-dashed border-gray-300 my-2 mx-4"></div>

            <div className="text-xl font-extrabold flex justify-between mx-4">
              <span className="text-lg font-medium">Tổng:</span>{' '}
              <span>{totalAmount.toLocaleString()} VNĐ</span>
            </div>
            <button className="mx-4 mt-4 w-11/12 px-6 py-3 rounded-lg bg-blue-500 text-white flex justify-center items-center">
              <IoBagCheckOutline size={24} />
              <span className="ml-2">Thanh toán</span>
            </button>
          </div>
        </div>
      </Suspense>
    </Page>
  );
};

export default CartPage;
