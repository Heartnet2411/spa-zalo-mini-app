import React, { useState, useEffect } from 'react';
import { Page, Text, useNavigate } from 'zmp-ui';
import Header from '../components/header';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';
import OrderTags from '../components/order-tag';
import { getUserOrderHistories } from '../services/payment.service';

const OrderStatusPage = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('Tất cả');
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
  }, [filterStatus]);

  return (
    <Page className="page">
      <Header />
      <div className='mt-16 mb-2'>
        {/* Filter Tags */}
        {/* <div className="mt-14 mb-2">
        <OrderTags
          selectedCategory={filterStatus}
          onSelectCategory={setFilterStatus}
        />
      </div> */}

        {/* Loading state */}
        {loading ? (
          <Text className="text-center">Loading...</Text>
        ) : error ? (
          <Text className="text-center text-red-500">{error}</Text>
        ) : orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order._id}>
                {/* Render your order details here */}
                <Text>Order ID: {order._id}</Text>
                <Text>Status: {order.paymentStatus}</Text>
              </li>
            ))}
          </ul>
        ) : (
          <Text className="text-center">Hiện tại chưa có đơn hàng</Text>
        )}
      </div>
    </Page>
  );
};

export default OrderStatusPage;
