import React, { useState, useEffect } from 'react';
import { Page, Text, Spinner } from 'zmp-ui';
import Header from '../components/header';
import VoucherTags from '../components/voucher-tag';
import { getUserVouchers } from '../services/voucher.service';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';
import { FaTicket } from 'react-icons/fa6';

const VoucherPage = () => {
  const [filterStatus, setFilterStatus] = useState('Ưu đãi');
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { accessToken } = useRecoilValue(userState);

  // Hàm định dạng ngày bằng cách sử dụng toLocaleDateString
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN'); // Định dạng ngày cho chuẩn tiếng Việt
  };

  useEffect(() => {
    if (filterStatus === 'Ưu đãi') {
      setLoading(true);
      getUserVouchers(accessToken)
        .then((data) => {
          setVouchers(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setVouchers([]); // Reset vouchers when switching to 'Lịch sử ưu đãi'
    }
  }, [filterStatus, accessToken]);

  const displayText = filterStatus === 'Ưu đãi'
    ? vouchers.length === 0
      ? 'Hiện tại chưa có voucher'
      : 'Danh sách voucher của bạn'
    : 'Hiện tại chưa có lịch sử voucher';

  return (
    <Page className="page">
      <Header />

      {/* Filter Tags */}
      <div className="mt-14 mb-2">
        <VoucherTags
          selectedCategory={filterStatus}
          onSelectCategory={setFilterStatus}
        />
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner size="large" />
          </div>
        ) : error ? (
          <Text className="text-center text-red-500">{error}</Text>
        ) : (
          <>
            <Text className="text-center mt-3 mb-3">{displayText}</Text>
            {/* Display vouchers if available */}
            <div className="list-none space-y-4">
              {vouchers.length > 0 &&
                vouchers.map((voucher) => (
                  <li
                    key={voucher._id}
                    className="border border-gray-300 p-4 rounded-md flex items-start"
                  >
                    {/* Hình biểu tượng FaTicket */}
                    <div className="mr-4">
                      <FaTicket size={40} className="text-red-500" />
                    </div>

                    {/* Nội dung voucher */}
                    <div>
                      {/* Mã voucher */}
                      <Text className="font-bold text-lg">{voucher.code}</Text>

                      {/* Mô tả voucher */}
                      <Text className="text-gray-600">
                        {voucher.description}
                      </Text>

                      {/* Hiệu lực voucher */}
                      <Text className="text-sm text-gray-500 mt-2">
                        Hiệu lực: {formatDate(voucher.validFrom)} -{' '}
                        {formatDate(voucher.validTo)}
                      </Text>
                    </div>
                  </li>
                ))}
            </div>
          </>
        )}
      </div>
    </Page>
  );
};

export default VoucherPage;
