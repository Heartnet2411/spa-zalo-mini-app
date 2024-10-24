import React, { useEffect, useState } from 'react';
import { Avatar, Text, Box, Page, Button, Icon, useNavigate } from 'zmp-ui';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Header from '../components/header';
import {
  getZaloAccessToken,
  getZaloPhoneNumber,
} from '../services/zalo.service';
import { loginAPI } from '../services/auth.service';
import { userState } from '../state';

const ProfilePage = () => {
  const [accessToken, setAccessToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const setUserState = useSetRecoilState(userState);
  const { userInfo: user } = useRecoilValue(userState);
  const navigate = useNavigate();

  // Hàm xác thực người dùng và lấy access token
  const handleAuthorization = async () => {
    try {
      const token = await getZaloAccessToken(); // Lấy accessToken từ Zalo
      setAccessToken(token);
    } catch (error) {
      console.error('Lỗi khi lấy access token:', error);
    }
  };

  // Hàm đăng nhập và lấy thông tin người dùng
  const handleLogin = async () => {
    if (!accessToken) {
      console.error('Không có access token để đăng nhập');
      return;
    }

    try {
      const result = await loginAPI(accessToken);
      if (result) {
        // Cập nhật thông tin người dùng vào Recoil state
        setUserState({
          userInfo: result.userProfile,
          phoneNumber: result.phoneNumber,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
    }
  };

  // Hàm lấy số điện thoại người dùng từ Zalo
  const fetchPhoneNumber = async () => {
    try {
      const phone = await getZaloPhoneNumber();
      setPhoneNumber(phone);
    } catch (error) {
      console.error('Lỗi khi lấy số điện thoại:', error);
    }
  };

  useEffect(() => {
    handleAuthorization(); // Bắt đầu xác thực khi component load
  }, []);

  useEffect(() => {
    if (accessToken) {
      handleLogin();
      fetchPhoneNumber();
    }
  }, [accessToken]);

  return (
    <Page className="page">
      <Header />
      <div className="p-4 mt-14 mb-14">
        <Box
          flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              {/* Display the first letter of the name if no avatar */}
              {user.avatar && user.avatar.startsWith('http') ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold">
                  {user.name ? user.name.charAt(0) : ''}
                </span>
              )}
            </div>

            <button
              className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1"
              onClick={() => {
                navigate('/form');
              }}
            >
              <Icon icon="zi-edit" className="text-white" size={20} />
            </button>
          </div>

          <Box mt={3}>
            <Text.Title>{user.name || 'Tên người dùng'}</Text.Title>
          </Box>
        </Box>

        {/* Hiển thị hạng người dùng */}
        <div className="flex justify-center rounded-md p-4 gap-2">
          <span
            className={`text-xl -mb-0.5 px-2 py-1 rounded-full relative ${
              user.membershipTier === 'Member'
                ? 'text-black'
                : user.membershipTier === 'Silver'
                  ? 'text-gray-400'
                  : user.membershipTier === 'Gold'
                    ? 'text-yellow-500'
                    : user.membershipTier === 'Platinum'
                      ? 'text-purple-500'
                      : ''
            }`}
          >
            {user.membershipTier || 'Chưa có hạng'}
            <sub className="absolute right-[-40px] top-[-10px]">
              <button
                className="px-2 py-1 rounded-xl bg-purple-500"
                onClick={() => {
                  navigate('/voucher');
                }}
              >
                <span className="text-white text-xs">Ưu đãi</span>
              </button>
            </sub>
          </span>
        </div>

        {/* Các phần khác của Profile */}
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-center">
            <button
              className="px-4 py-2 rounded-full flex items-center justify-center bg-red-500"
              onClick={() => {
                navigate('/order-status');
              }}
            >
              <span className="text-white">Đơn hàng đã mua</span>
            </button>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="px-4 py-2 rounded-full flex items-center justify-center border border-red-500"
              onClick={() => {
                navigate('/rating');
              }}
            >
              <span className="text-red-500">Đánh giá sản phẩm</span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center mt-5">
          <div className="w-80 rounded-lg border flex items-center justify-around">
            <div className="flex flex-col items-start mr-20">
              <span className="text-xl font-bold mb-1">Điểm</span>
              <div className="flex items-end text-orange-500 gap-2">
                <span>{user.points}</span>
                <Icon icon="zi-star" className="mb-0.5" size={20} />
              </div>
            </div>
            <button
              className="w-20 h-10 rounded-xl bg-green-500"
              onClick={() => navigate('/list-voucher')}
            >
              <span className="text-white">Đổi ưu đãi</span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center mt-5">
          <div className="w-80 rounded-lg border flex items-center justify-around">
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold mb-1">Tiếp thị liên kết</span>
              <span className="mt-1 text-orange-500">0 VND</span>
            </div>
            <button
              className="w-20 h-10 rounded-xl bg-orange-400"
              onClick={() => navigate('/referral')}
            >
              <span className="text-white">Chi tiết</span>
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ProfilePage;
