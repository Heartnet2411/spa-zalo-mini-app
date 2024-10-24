import React, { useEffect, useState } from 'react';
import { Avatar, Text, Box, Page, Button, Icon, useNavigate } from 'zmp-ui';
import Header from '../components/header';
import {
  getZaloAccessToken,
  getZaloPhoneNumber,
} from '../services/zalo.service';
import { loginAPI } from '../services/auth.service';
import { userState } from '../state';
import { useRecoilValue, useSetRecoilState } from 'recoil';
const ProfilePage = () => {
  const [accessToken, setAccessToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const setUserState = useSetRecoilState(userState);
  const { userInfo: user } = useRecoilValue(userState);
  const navigate = useNavigate();

  const rankDisplayMapping = {
    Member: 'Thành Viên',
    Silver: 'Bạc',
    Gold: 'Vàng',
    Diamond: 'Kim Cương',
  };

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
          <Box>
            <Avatar
              size={96}
              src={
                user.avatar && user.avatar.startsWith('http')
                  ? user.avatar
                  : undefined
              }
            >
              {/* Hiển thị chữ cái đầu nếu không có avatar */}
              {!user.avatar && user.name ? user.name.charAt(0) : ''}
            </Avatar>
          </Box>
          <Box flex flexDirection="row" alignItems="center" ml={8}>
            <Box>
              <Text.Title>{user.name || 'Tên người dùng'}</Text.Title>
            </Box>
            <Box ml={4}>
              <Button
                onClick={() => {
                  navigate('/form');
                }}
                size="small"
                icon={<Icon icon="zi-edit" />}
              />
            </Box>
          </Box>
        </Box>

        {/* Hiển thị hạng người dùng */}
        <div className="flex items-center justify-center mt-10">
          <div className="w-80 rounded-lg border flex items-center justify-center flex-col">
            <span className="text-xl font-bold text-blue-500 mt-3">
              Hạng:{' '}
              <span className="mt-3 mb-3 text-black font-normal">
                {rankDisplayMapping[user.membershipTier] || 'Chưa có hạng'}
              </span>
            </span>

            <button
              className="w-14 h-6 rounded-xl bg-red-500 mt-5 mb-5"
              onClick={() => {
                navigate('/voucher');
              }}
            >
              <span className="text-white">Ưu đãi</span>
            </button>
          </div>
        </div>

        {/* Các phần khác của Profile */}
        <div className="flex items-center justify-center mt-5">
          <button
            className="w-80 h-10 rounded-full flex items-center justify-center bg-red-500"
            onClick={() => {
              navigate('/order-status');
            }}
          >
            <span className="ml-2 text-base text-white">Đơn hàng đã mua</span>
          </button>
        </div>
        <div className="flex items-center justify-center mt-5">
          <button
            className="w-80 h-10 rounded-full flex items-center justify-center border"
            onClick={() => {
              navigate('/rating');
            }}
          >
            <span className="ml-2 text-base">Đánh giá sản phẩm</span>
          </button>
        </div>
        <div className="flex items-center justify-center mt-5">
          <div className="w-80 rounded-lg border flex items-center justify-around">
            <div className="flex flex-col items-start mr-20">
              <span className="text-xl font-bold mb-1">
                Điểm:{' '}
                <span className="text-orange-400 mb-1 font-normal">{user.points}</span>
              </span>

              <Icon icon="zi-star" className="text-orange-500" />
            </div>
            <button className="w-20 h-10 rounded-xl bg-green-500">
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
            <button className="w-20 h-10 rounded-xl bg-orange-400">
              <span className="text-white">Chi tiết</span>
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ProfilePage;
