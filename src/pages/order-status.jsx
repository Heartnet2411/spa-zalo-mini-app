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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getUserOrderHistories(accessToken, currentPage, limit);
        const filteredOrders = data.orders.filter(order => order.products.length > 0);
        setOrders(filteredOrders);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError('Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

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
              order.products.map((product) => (
                <div
                  className="bg-white p-2 rounded-lg shadow-md border w-full mb-4"
                >
                  <text className="text-orange-600 flex justify-end ">
                    {order.paymentStatus}
                  </text>
                  <div className="h-24 w-24 bg-gray-300 rounded-md mb-2 flex items-center justify-center">
                    <img src={product.images[0]} alt="Product" />
                  </div>
                  <div className="flex items-center">
                    <div className="mt-2 flex items-center ">
                      <Text className="text-lg">{product.productName} - {product.volume} x {product.quantity}</Text>
                      <Text className="text-sm text-gray-600">
                        Tổng số tiền: đ{product.price * product.quantity}
                      </Text>
                    </div>
                  </div>
                  <div className="flex justify-end mt-5">
                    {product.rated ? (
                      <button
                        className="w-20 h-10 border border-gray-500 rounded-lg" disabled
                      >
                        <span className="text-gray-500">Đã đánh giá</span>
                      </button>
                    ) : (
                      <button
                        className="w-20 h-10 border border-orange-500 rounded-lg"
                        onClick={() => navigate(`/ratingdetail`, { state: { order, product } })}
                      >
                        <span className="text-orange-500">Đánh giá</span>
                      </button>
                    )}
                  </div>
                </div>
              )
              )))
          ) : (
            <Text className="text-center">Hiện tại chưa có đơn hàng</Text>
          )}
          <div className="flex justify-between mt-4 w-full">
            <button onClick={handlePrevPage} disabled={currentPage === 1} className="border px-4 py-2 rounded">
              Trước
            </button>
            <Text>{`Trang ${currentPage} / ${totalPages}`}</Text>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="border px-4 py-2 rounded">
              Sau
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default OrderStatusPage;
