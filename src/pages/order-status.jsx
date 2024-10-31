import React, { useState, useEffect } from 'react';
import { Page, Text, useNavigate } from 'zmp-ui';
import Header from '../components/header';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';
import { getUserOrderHistories } from '../services/payment.service';
import { Link } from 'react-router-dom';
import Pagination from '../components/pagination';

const OrderStatusPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken } = useRecoilValue(userState);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;
  console.log('user order', orders);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getUserOrderHistories(
          accessToken,
          currentPage,
          limit
        );
        const filteredOrders = data.orders.filter(
          (order) => order.products.length > 0
        );
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
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
            orders.map((order) =>
              order.products.map((product) => (
                <div className="bg-white px-2 py-4 rounded-lg shadow-md border w-full mb-4">
                  {/* <text className="text-orange-600 flex justify-end ">
                    {order.paymentStatus}
                  </text> */}
                  <div className="flex gap-4">
                    <div className="h-24 w-36 bg-gray-300 rounded-md mb-2 flex items-center justify-center">
                      <Link
                        to={`/product/${product.productId}`}
                        key={product.productId}
                      >
                        <img src={product.images[0] || null} alt="Product" />
                      </Link>
                    </div>
                    <div className="flex flex-col justify-start w-full gap-2">
                      <div className="flex flex-col justify-start w-full gap-2">
                        <span className="font-bold">{product.productName}</span>
                        <div className="flex justify-between">
                          <span>
                            <span className="text-gray-600">Loại: </span>
                            {product.volume}
                          </span>
                          <span>x {product.quantity}</span>
                        </div>
                      </div>
                      <Text className="">
                        <span className="text-gray-600">Tổng số tiền: </span>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(product.price * product.quantity)}
                      </Text>
                      <Text className="">
                        <span className="text-gray-600">Ngày mua: </span>
                        <span>
                          {new Date(order.orderDate)
                            .getDate()
                            .toString()
                            .padStart(2, '0')}
                          /
                          {(new Date(order.orderDate).getMonth() + 1)
                            .toString()
                            .padStart(2, '0')}
                          /{new Date(order.orderDate).getFullYear()} -{' '}
                          {`${new Date(order.orderDate).getHours()}h${new Date(order.orderDate).getMinutes().toString().padStart(2, '0')}`}
                        </span>
                      </Text>
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    {product.rated ? (
                      <button
                        className="p-2 h-10 border border-gray-500 rounded-lg"
                        disabled
                      >
                        <span className="text-gray-500">Đã đánh giá</span>
                      </button>
                    ) : (
                      <button
                        className="p-2 h-10 border border-orange-500 rounded-lg"
                        onClick={() =>
                          navigate(`/ratingdetail`, {
                            state: { order, product },
                          })
                        }
                      >
                        <span className="text-orange-500">Đánh giá</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            <Text className="text-center">Hiện tại chưa có đơn hàng</Text>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </Page>
  );
};

export default OrderStatusPage;
