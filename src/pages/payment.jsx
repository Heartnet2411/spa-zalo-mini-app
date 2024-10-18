import React, { useEffect, useState } from 'react';
import { Page, Button, useNavigate, Input, List } from 'zmp-ui';
import Header from '../components/header';
import { useLocation } from 'react-router-dom';
import { userState } from '../state';
import { useRecoilState } from 'recoil';

import {
  createMac,
  createOrder,
  updateOrderWithZaloOrderId,
} from '../services/payment.service';
import { Payment } from 'zmp-sdk';
const { Item } = List;

const PaymentPage = () => {
  const navigate = useNavigate();
  const [user, setUserState] = useRecoilState(userState);
  console.log(user);
  // DEMO TRƯỚC HÀM TẠO HÓA ĐƠN
  async function createOrderPayment(products, addedVoucher) {
    // THÔNG TIN HÓA ĐƠN (products phải truyền đủ productId, variantId, productName, price, quantity)
    // ***DEMO NÀY CHƯA CÓ productName
    const orderDetails = {
      orderDate: new Date().toJSON(), // Ngày tạo hóa đơn
      totalAmount: products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      ), // Tổng hóa đơn
      paymentMethod: 'ZALOPAY_SANDBOX', // Phương thức thanh toán
      paymentStatus: 'pending', // Lúc này cần tạo hóa đơn dưới BE để tạo mac cho Zalo trước
      remarks: 'nun',
      products: products,
      voucherId: addedVoucher, // Mã voucher
    };

    console.log('Order Details:', orderDetails);

    // Tạo hóa đơn phía server
    const order = await createOrder(orderDetails, user.accessToken);

    console.log(order);

    if (order) {
      // TẠO HÓA ĐƠN THEO FORMAT ZALO ĐỂ TẠO MAC
      const item = order.products.map((item) => ({
        id: String(item.productId),
        // variantId: String(item.variantId),
        amount: item.quantity * item.price,
      }));

      const paymentMethod = {
        id: 'ZALOPAY_SANDBOX',
        isCustom: false,
      };

      // THÔNG TIN THÊM
      const extraData = {
        orderId: order._id, // id mà chúng ta đã tạo ở server của mình
        notes: JSON.stringify(order),
      };

      const orderData = {
        desc: `Thanh toan ${order.finalAmount}`,
        item,
        amount: order.finalAmount,
        extradata: JSON.stringify(extraData),
        method: JSON.stringify(paymentMethod),
      };

      // TẠO MÃ MAC
      const getmac = await createMac(orderData, user.accessToken);

      if (getmac) {
        // CẬP NHẬT MÃ MAC CHO HÓA ĐƠN VÀ DÙNG Payment.createOrder ĐỂ THANH TOÁN
        orderData.mac = getmac.mac;

        return new Promise((resolve, reject) => {
          Payment.createOrder({
            ...orderData,
            success: async (data) => {
              // Tạo đơn hàng thành công
              const { orderId } = data;
              console.log('Good: ', orderId);

              try {
                // TẠO HÓA ĐƠN PHÍA ZALO THÀNH CÔNG THÌ GỌI HÀM NÀY ĐỂ CẬP NHẬT TRẠNG THÁI + GIẢM SỐ LƯỢNG SẢN PHẨM TRONG KHO
                const updateOrder = await updateOrderWithZaloOrderId(
                  order._id,
                  {
                    transactionId: orderId,
                    paymentStatus: 'completed',
                  },
                  user.accessToken
                );
                if (updateOrder) {
                  resolve(updateOrder);
                } else {
                  reject('Failed to update order');
                }
              } catch (err) {
                console.log(err);
                reject('Error updating order');
              }
            },
            fail: (err) => {
              // Tạo đơn hàng lỗi
              console.log(err);
              reject(err);
            },
          });
        });
      } else {
        console.log('Cannot create mac');
        return Promise.reject('MAC creation failed');
      }
    } else {
      console.log('Cannot create order');
      return Promise.reject('Order creation failed');
    }
  }

  const location = useLocation();
  const { cart } = location.state || { cart: [] };
  console.log('hello', location.state);

  const [products, setProducts] = useState([]);
  console.log('nihao', products);
  // const [productId, setProductId] = useState('');
  // const [variantId, setVariantId] = useState('');
  // const [quantity, setQuantity] = useState(1);
  // const [price, setPrice] = useState(0);
  const [voucherId, setVoucherId] = useState('');
  const [addedVoucher, setAddedVoucher] = useState('');

  const handleAddProduct = (cartItem) => {
    if (cartItem && cartItem.quantity > 0) {
      const { productId, productName, variantId, price, quantity } = cartItem;

      // Sử dụng callback trong setProducts để đảm bảo cập nhật state chính xác
      setProducts((prevProducts) => [
        ...prevProducts,
        {
          productId: productId, // Lấy productId từ object
          variantId: variantId, // Lấy variantId từ object
          productName: productName, // Lấy tên sản phẩm
          price: price, // Lấy giá
          quantity: quantity, // Lấy số lượng
        },
      ]);
    }
  };

  // Sử dụng useEffect để lặp qua giỏ hàng và thêm sản phẩm
  useEffect(() => {
    if (cart && cart.length > 0) {
      cart.forEach((cartItem) => handleAddProduct(cartItem));
    }
  }, [cart]);

  const handleAddVoucher = () => {
    if (voucherId) {
      setAddedVoucher(voucherId);
      setVoucherId('');
    }
  };

  // DỮ LIỆU MẪU
  // const handleGetDemoData = () => {
  //   const demoProducts = [
  //     {
  //       productId: '66ffc86b8e0ecf5d894bebd7',
  //       variantId: '66ffc86b8e0ecf5d894bebd9',
  //       price: 6000,
  //       quantity: 1,
  //     },
  //     {
  //       productId: '66ffc86b8e0ecf5d894bebb4',
  //       variantId: '66ffc86b8e0ecf5d894bebb5',
  //       price: 24000,
  //       quantity: 2,
  //     },
  //   ];
  //   setProducts(demoProducts);
  //   setAddedVoucher('670c96962b6d99a13c41e749');
  // };

  const handleSubmit = async () => {
    try {
      const result = await createOrderPayment(products, addedVoucher);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Page className="page ">
      <Header />
      <div className="px-4 mt-16">
        <div>
          {cart.length > 0 ? (
            cart.map((item, index) => (
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
                    <h2 className="text-xl font-semibold">
                      {item.productName}
                    </h2>
                    <span className="my-4">{item.volume}</span>

                    <div>
                      <p className="font-bold text-base">
                        {(item.price * item.quantity).toLocaleString()} VNĐ
                      </p>
                    </div>

                    <div className="flex justify-between w-full">
                      <div className="flex items-center ">
                        <span className="text-base font-bold ">
                          Số lượng: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Giỏ hàng của bạn đang trống.</p>
          )}
        </div>
        <div className="relative mb-2 mx-4">
          <input
            type="text"
            placeholder="Thêm mã giảm giá"
            className="px-4 py-4 border rounded-md w-full  focus:outline-blue-500"
            value={voucherId}
            onChange={(e) => setVoucherId(e.target.value)}
          />

          <button
            size={18}
            onClick={handleAddVoucher}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer bg-blue-500 px-6 py-2 rounded-md"
          >
            {' '}
            Thêm
          </button>
        </div>
        <div>
          {addedVoucher ? (
            <div className="font-medium text-lg mb-4 flex flex-col items-center">
              <h4>Voucher</h4>
              <span>Voucher ID: {addedVoucher}</span>
            </div>
          ) : (
            <p className="font-medium text-lg text-center mb-4">
              No voucher added
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Button type="primary" onClick={handleSubmit}>
            Thanh toán ngay
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default PaymentPage;
