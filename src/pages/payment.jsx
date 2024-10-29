import React, { useEffect, useState } from 'react';
import { Page, Button, Input, List, Grid, Box, Stack } from 'zmp-ui';
import Header from '../components/header';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentResultState, userState } from '../state';
import { getUserVouchers } from '../services/voucher.service';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getAllAddress } from '../services/user.service';
import AddAddressModal from '../components/add-address-modal';

import {
  createMac,
  createMacForGetOrderStatus,
  createOrder,
  getZaloOrderStatus,
  updateOrderWithZaloOrderId,
} from '../services/payment.service';
import { Payment } from 'zmp-sdk';
import { EventName, events, showToast } from 'zmp-sdk/apis';
import { FaTicket } from 'react-icons/fa6';
const { Item } = List;

const PaymentPage = () => {
  const navigate = useNavigate();
  const [user, setUserState] = useRecoilState(userState);
  const [paymentResult, setPaymentResult] = useRecoilState(paymentResultState);
  const { accessToken } = useRecoilValue(userState);

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
              console.log('Good: ', data);

              resolve(orderId);
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

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(totalAmount);

  const [products, setProducts] = useState([]);
  console.log('nihao', products);
  // const [productId, setProductId] = useState('');
  // const [variantId, setVariantId] = useState('');
  // const [quantity, setQuantity] = useState(1);
  // const [price, setPrice] = useState(0);
  const [voucherId, setVoucherId] = useState('');
  const [addedVoucher, setAddedVoucher] = useState('');
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

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

  // Fetch user's vouchers when the page loads
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const userVouchers = await getUserVouchers(user.accessToken);
        setVouchers(userVouchers); // Set the fetched vouchers
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    };

    fetchVouchers();
  }, [user.accessToken]);

  const handleAddVoucher = (voucherId) => {
    const voucher = vouchers.find((v) => v._id === voucherId);
    if (voucher) {
      console.log("YOH: ", voucher)
      setAddedVoucher(voucher._id);
      setSelectedVoucher(voucher)
      setDiscountAmount((totalAmount * voucher.discountValue) / 100);
      setFinalAmount(totalAmount - (totalAmount * voucher.discountValue) / 100);
      setVoucherId('');
    }
  };

  const renderVoucherOptions = () => {
    return vouchers.length > 0 ? (
      <select
        className="px-4 py-4 border rounded-md w-full"
        value={voucherId}
        onChange={(e) => handleAddVoucher(e.target.value)}
      >
        <option value="">Chọn voucher</option>
        {vouchers.map((voucher) => (
          <option key={voucher._id} value={voucher._id}>
            {voucher.code} - {voucher.discountValue}%
          </option>
        ))}
      </select>
    ) : (
      <p>No vouchers available</p>
    );
  };

  // Payment event handling inside useEffect
  useEffect(() => {
    const handleOpenAppEvent = (data) => {
      const params = data?.path;

      if (params.includes('/payment-result')) {
        // Calling Zalo API to check the transaction
        Payment.checkTransaction({
          data: params,
          success: async (rs) => {
            const { orderId, transId, resultCode, extradata } = rs;

            let parsedExtradata;
            try {
              parsedExtradata =
                typeof extradata === 'string'
                  ? JSON.parse(extradata)
                  : extradata;
            } catch (error) {
              console.error('Error parsing extradata:', error);
            }

            console.log(parsedExtradata?.orderId);

            if (resultCode === 1) {
              try {
                const updateOrder = await updateOrderWithZaloOrderId(
                  parsedExtradata.orderId,
                  {
                    transactionId: orderId,
                    paymentStatus: 'completed',
                  },
                  user.accessToken
                );

                if (updateOrder.paymentStatus === 'completed') {
                  console.log('Payment successfully updated', updateOrder.data);
                  setPaymentResult({ orderId, status: 'success' });
                  navigate('/payment-result');
                } else {
                  console.log('Payment update failed');
                  setPaymentResult({ orderId, status: 'fail' });
                  navigate('/payment-result');
                  showToast({ message: 'Lỗi cập nhật đơn hàng' });
                }
              } catch (err) {
                console.error('Error updating order:', err);
                showToast({ message: 'Lỗi cập nhật đơn hàng' });
              }
            }
          },
          fail: (err) => {
            console.error('Payment check failed:', err);
            showToast({ message: 'Lỗi giao dịch' });
          },
        });
      }
    };

    const handlePaymentCloseEvent = async (data) => {
      const resultCode = data?.resultCode;

      if (resultCode === 0) {
        // Recheck the transaction on close
        Payment.checkTransaction({
          data: { zmpOrderId: data?.zmpOrderId },
          success: (rs) => {
            console.log('Transaction recheck:', rs);
            showToast({ message: 'Giao dịch bị gián đoạn!' });
          },
          fail: (err) => {
            console.error('Recheck failed:', err);
            showToast({ message: 'Lỗi giao dịch!' });
          },
        });
      } else {
        Payment.checkTransaction({
          data: { zmpOrderId: data?.zmpOrderId },
          success: async (rs) => {
            const { orderId, transId, resultCode, extradata } = rs;

            let parsedExtradata;
            try {
              parsedExtradata =
                typeof extradata === 'string'
                  ? JSON.parse(extradata)
                  : extradata;
            } catch (error) {
              console.error('Error parsing extradata:', error);
            }

            console.log(parsedExtradata?.orderId);

            if (resultCode === 1) {
              try {
                const updateOrder = await updateOrderWithZaloOrderId(
                  parsedExtradata.orderId,
                  {
                    transactionId: orderId,
                    paymentStatus: 'completed',
                  },
                  user.accessToken
                );

                if (updateOrder.paymentStatus === 'completed') {
                  console.log('Payment successfully updated', updateOrder.data);
                  setPaymentResult({ orderId, status: 'success' });
                  navigate('/payment-result');
                } else {
                  console.log('Payment update failed');
                  setPaymentResult({ orderId, status: 'fail' });
                  navigate('/payment-result');
                  showToast({ message: 'Lỗi cập nhật đơn hàng' });
                }
              } catch (err) {
                console.error('Error updating order:', err);
                showToast({ message: 'Lỗi cập nhật đơn hàng' });
              }
            }
          },
          fail: (err) => {
            console.error('Payment check failed:', err);
            showToast({ message: 'Lỗi giao dịch' });
          },
        });
      }
    };

    // Register event listeners
    events.on(EventName.OpenApp, handleOpenAppEvent);
    events.on(EventName.PaymentClose, handlePaymentCloseEvent);

    // Cleanup event listeners on unmount
    return () => {
      events.off(EventName.OpenApp, handleOpenAppEvent);
      events.off(EventName.PaymentClose, handlePaymentCloseEvent);
    };
  }, []);

  const handleSubmit = async () => {
    try {
      const result = await createOrderPayment(products, addedVoucher);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  const [userAddress, setUserAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const handleAddAddressClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchAddress = async () => {
      const data = await getAllAddress(user.accessToken);
      if (data) setUserAddress(data);
      if (data.length > 0) {
        setSelectedAddress(data[0]);
      }
    };
    fetchAddress();
  }, [isModalOpen]);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address); // Cập nhật địa chỉ đã chọn
  };

  const toggleShowAllAddresses = () => {
    setShowAllAddresses((prev) => !prev); // Chuyển đổi trạng thái hiển thị
  };

  return (
    <Page className="page absolute">
      <Header />
      <div className="px-4 relative min-h-screen mb-40">
        <h2 className=" text-center font-semibold text-xl mb-2 mt-16 ">
          Địa chỉ của bạn
        </h2>
        {userAddress.length > 0 ? (
          <>
            {/* Hiển thị toàn bộ địa chỉ nếu được yêu cầu */}
            {showAllAddresses ? (
              <ul className="space-y-2 mt-2">
                {userAddress.map((address, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectAddress(address)}
                    className={`cursor-pointer p-4 border rounded-lg ${selectedAddress === address ? 'bg-gray-300' : 'bg-white'
                      }`}
                  >
                    {address.city}, {address.district}, {address.ward},{' '}
                    {address.number}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="cursor-pointer p-4 border rounded-lg bg-gray-200">
                {userAddress[0].city}, {userAddress[0].district},{' '}
                {userAddress[0].ward}, {userAddress[0].number}
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600">Chưa có địa chỉ nào.</p>
        )}
        <div className="flex justify-between">
          <button
            onClick={toggleShowAllAddresses}
            className="py-2 text-blue-500 hover:underline"
          >
            {showAllAddresses ? 'Ẩn bớt' : 'Xem thêm'}
          </button>
          <button
            onClick={handleAddAddressClick}
            className=" text-blue-500 py-2 rounded hover:underline"
          >
            Thêm địa chỉ
          </button>
        </div>

        <AddAddressModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          accessToken={accessToken}
        />

        <div>
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div
                key={item.productId}
                className="border rounded-lg p-4 bg-gray-100 mb-1 flex items-center justify-between"
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
        <div className="border-t mt-6 py-4">
          <div className="flex items-center justify-center">
            <span className="font-bold text-lg">Voucher</span>
          </div>
          <div className="mt-2">{renderVoucherOptions()}</div>
          {selectedVoucher ? (
            <div className="border-red-500 text-red-500 border px-3 py-4 rounded my-2 flex items-center gap-4">
              <FaTicket size={24} className="text-red-500" />
              <span>{selectedVoucher.code}</span>
              <span className="ml-auto">{selectedVoucher.discountValue} %</span>
            </div>
          ) : (
            <p className="text-center my-4 text-red-500">Không có Voucher</p>
          )}
        </div>
      </div>
      <div className="h-fit pt-2 flex flex-col items-center bg-white border-t fixed bottom-0 w-full pb-2">
        <div className="text-base font-extrabold flex justify-between w-4/5">
          <span className="text-base font-medium">Tổng:</span>{' '}
          <span>{totalAmount.toLocaleString()} VNĐ</span>
        </div>
        <div className="text-basel font-extrabold flex justify-between w-4/5">
          <span className="text-base font-medium">Giảm giá:</span>{' '}
          <span>{discountAmount.toLocaleString()} VNĐ</span>
        </div>
        <div className="border-t-2 border-dashed border-gray-500 my-2 w-4/5"></div>
        <div className="text-base font-extrabold flex justify-between w-4/5">
          <span className="text-base font-medium">Tổng thanh toán</span>{' '}
          <span>{finalAmount.toLocaleString()} VNĐ</span>
        </div>
        <button
          className="bg-blue-500 mt-2 w-4/5 py-2 rounded-xl text-white"
          onClick={handleSubmit}
        >
          Thanh toán ngay
        </button>
      </div>
    </Page>
  );
};

export default PaymentPage;
