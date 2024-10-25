import React, { useState, useEffect } from 'react';
import { Page, Text, useNavigate } from 'zmp-ui';
import Header from '../components/header';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';
import { getUserOrderHistories } from '../services/payment.service';

const OrderStatusPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken } = useRecoilValue(userState);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getUserOrderHistories(accessToken);
        setOrders(data.orders);
      } catch (error) {
        setError('Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Page className="page">
      <Header />
      <div className="p-4 mt-14 mb-14">
        <div className="flex flex-col items-center justify-center w-full">
          {loading ? (
            <Text className="text-center">Loading...</Text>
          ) : error ? (
            <Text className="text-center text-red-500">{error}</Text>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-2 rounded-lg shadow-md border w-full mb-4"
              >
                <text className="text-orange-600 flex justify-end ">
                  {order.paymentStatus}
                </text>
                <div className="h-24 w-24 bg-gray-300 rounded-md mb-2 flex items-center justify-center">
                  {/* Add actual image here when available, e.g., <img src={product.image} alt="Product" /> */}
                  <text className="text-gray-500">Image</text>
                </div>
                <div className="flex items-center">
                  <div className="mt-2 flex items-center ">
                    {order.products.map((product) => (
                      <div key={product._id} className="mb-2">
                        <text className="text-lg">{product.productName}</text>
                        <text className="text-sm text-gray-600">
                          x{product.quantity}
                        </text>
                        <text className="text-sm text-gray-600">
                          Tổng số tiền: đ{product.price}
                        </text>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    className="w-20 h-10 border border-orange-500 rounded-lg"
                    onClick={() => navigate(`/rating`, { state: { order } })}
                  >
                    <span className="text-orange-500">Đánh giá</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <Text className="text-center">Hiện tại chưa có đơn hàng</Text>
          )}
        </div>
      </div>
    </Page>
  );
};

export default OrderStatusPage;
