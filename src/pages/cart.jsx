import React, { Suspense, useState, useEffect } from 'react';
import { Button, Input, Box, Page, useSnackbar } from 'zmp-ui';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { IoBagCheckOutline } from 'react-icons/io5';
import { LiaTimesSolid } from 'react-icons/lia';
import Header from '../components/header';
import {
  fetchUserCart,
  removeItemFromCart,
  updateQuantityInCart,
} from '../services/cart.service';
import { userState } from '../state';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const handleCheckout = () => {
    navigate('/payment', {
      state: {
        cart, // Truyền mảng cart
      },
    });
  };

  const [user, setUserState] = useRecoilState(userState);
  console.log(cart);

  const getUserCart = async () => {
    const cart = await fetchUserCart(user.accessToken);
    if (cart) {
      setCart(cart.carts);
    } else {
      throw new Error('Failed to fetch cart data');
    }
  };

  useEffect(() => {
    getUserCart();
    // Gọi hàm fetchProducts
  }, []);

  const plusCartQuantity = async (productId, variantId, quantity) => {
    const result = await updateQuantityInCart(
      productId,
      variantId,
      quantity + 1,
      user.accessToken
    );
    if (result) {
      console.log('Cập nhật thành công', result);
      const cart = await fetchUserCart(user.accessToken);
      if (cart) {
        setCart(cart.carts);
      } else {
        throw new Error('Failed to fetch cart data');
      }
    } else {
      console.log('Cập nhật thất bại');
      // Hiển thị thông báo lỗi cho người dùng nếu cần
    }
  };

  const reduceCartQuantity = async (productId, variantId, quantity) => {
    const result = await updateQuantityInCart(
      productId,
      variantId,
      quantity - 1,
      user.accessToken
    );
    if (result) {
      console.log('Cập nhật thành công', result);
      const cart = await fetchUserCart(user.accessToken);
      if (cart) {
        setCart(cart.carts);
      } else {
        throw new Error('Failed to fetch cart data');
      }
    } else {
      console.log('Cập nhật thất bại');
      // Hiển thị thông báo lỗi cho người dùng nếu cần
    }
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleRemoveCartItem = async (productId) => {
    const result = await removeItemFromCart(productId, user.accessToken);
    if (result) {
      console.log('Sản phẩm đã được thêm vào giỏ hàng:', result);
      alert('Sản phẩm đã được xóa khỏi giỏ hàng!');
      getUserCart();
    } else {
      console.log('Không thể thêm sản phẩm vào giỏ hàng.');
    }
  };

  return (
    <Page className="page ">
      <Suspense>
        <Header />
        <div className="px-6 mt-14 mb-28">
          <div className="overflow-scroll scroll-container ">
            <h1 className="text-xl font-bold mb-2 text-center mt-2">
              Các sản phẩm của bạn
            </h1>
            {cart.length > 0 ? ( // Kiểm tra xem giỏ hàng có sản phẩm hay không
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="border rounded-lg p-4 bg-gray-100 mb-2 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-28 h-28 object-contain mr-4 bg-white rounded-lg"
                    />
                    <div style={{ width: 'calc(100vw - 13rem)' }} className="">
                      <h2 className="text-lg font-semibold">
                        {item.productName}
                      </h2>
                      <span className="my-4">{item.volume}</span>

                      <div>
                        <p className="font-bold text-lg">
                          {(item.price * item.quantity).toLocaleString()} VNĐ
                        </p>
                      </div>

                      <div className="flex justify-between w-full">
                        <div className="flex items-center border border-gray-500 p-1 px-3 rounded-lg mt-2">
                          <button
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              reduceCartQuantity(
                                item.productId,
                                item.variantId,
                                item.quantity
                              )
                            }
                          >
                            <FiMinus size={24} />
                          </button>
                          <span className="text-lg font-bold px-4">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              plusCartQuantity(
                                item.productId,
                                item.variantId,
                                item.quantity
                              )
                            }
                          >
                            <FiPlus size={24} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveCartItem(item.productId)}
                        >
                          <LiaTimesSolid size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-lg font-bold text-gray-500 mt-4">
                Giỏ hàng trống
              </p> // Hiển thị thông báo giỏ hàng trống
            )}
          </div>
        </div>
        <div className="h-fit pt-2 flex flex-col items-center bg-white border-t fixed bottom-0 w-full pb-2">
          <div className="text-xl font-extrabold flex justify-between w-4/5">
            <span className="text-lg font-medium">Tổng:</span>{' '}
            <span>{totalAmount.toLocaleString()} VNĐ</span>
          </div>
          <button
            onClick={handleCheckout}
            className=" mt-2 py-3 w-4/5 rounded-lg bg-blue-500 text-white flex justify-center items-center"
          >
            <IoBagCheckOutline size={24} />
            <span className="ml-2">Thanh toán</span>
          </button>
        </div>
      </Suspense>
    </Page>
  );
};

export default CartPage;
