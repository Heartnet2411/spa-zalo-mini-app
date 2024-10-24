import React, { useEffect, useState } from 'react';
import { Page, Text } from 'zmp-ui';
import { getVouchersUserCanExchange, exchangeVoucher } from '../services/voucher.service';
import Header from '../components/header';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';
import { FaTicket } from 'react-icons/fa6';

const ListVoucherPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo: user, accessToken } = useRecoilValue(userState);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await getVouchersUserCanExchange(accessToken);
        setVouchers(data.vouchers || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchVouchers();
    }
  }, [accessToken]);

  // Hàm định dạng ngày bằng cách sử dụng toLocaleDateString
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN'); // Định dạng ngày cho chuẩn tiếng Việt
  };

  // Hàm xử lý đổi ưu đãi
  const handleExchange = async (voucherId) => {
    try {
      await exchangeVoucher(voucherId, accessToken);
      // Có thể cần thêm logic để cập nhật lại danh sách voucher sau khi đổi
      alert('Đổi ưu đãi thành công!');
    } catch (err) {
      alert('Đổi ưu đãi thất bại: ' + err.message);
    }
  };

  return (
    <Page className="page">
      <Header />
      <div className="p-4 mt-14 mb-2">
        {/* Hiển thị điểm của người dùng */}
        <text className="flex justify-center font-bold text-lg text-yellow-500 mb-3">
          Điểm của bạn là: {user.points}
        </text>

        {loading && <Text>Đang tải...</Text>}
        {error && <Text>Error: {error}</Text>}
        {!loading && !error && vouchers.length === 0 && (
          <Text>Không có ưu đãi nào hiện tại</Text>
        )}
        {!loading && !error && vouchers.length > 0 && (
          <ul className="list-none space-y-4">
            {vouchers.map((voucher) => (
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
                  <Text className="text-gray-600">{voucher.description}</Text>

                  {/* Hiệu lực voucher */}
                  <Text className="text-sm text-gray-500 mt-2">
                    Hiệu lực: {formatDate(voucher.validFrom)} -{' '}
                    {formatDate(voucher.validTo)}
                  </Text>

                  <Text className="text-red-500">
                    Điểm yêu cầu: {voucher.exchangePoints}
                  </Text>

                  {/* Nút đổi ưu đãi */}
                  <div className="self-center mb-2 mt-3">
                    <button
                      className="px-3 py-2 border border-red-500 rounded-md text-red-500"
                      onClick={() => handleExchange(voucher._id)}
                    >
                      Đổi ưu đãi
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Page>
  );
};

export default ListVoucherPage;
