import React, { useEffect, useState, Suspense } from 'react';
import { Avatar, List, Text, Box, Page, Button, Icon, useNavigate } from 'zmp-ui';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Header from '../components/header';
import { getZaloAccessToken, getZaloInfo } from '../services/zalo.service'; 
import { loginAPI, registerAPI } from '../services/auth.service'; 
import { testAPI } from '../services/test.service'; 
import { userState } from '../state'; 

const ProfilePage = () => {
  const [data, setData] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [authData, setAuthData] = useState(null); 
  const [loginData, setLoginData] = useState(null); 

  const setUserState = useSetRecoilState(userState); 
  const navigate = useNavigate();
  
  
  const { userInfo: user } = useRecoilValue(userState); 

  // Hàm xử lý xác thực và lấy access token
  const handleAuthorization = async () => {
    try {
      const authResult = await getZaloInfo();
      setAuthData(authResult);
      const token = await getZaloAccessToken();
      setAccessToken(token);
    } catch (error) {
      console.error('Lỗi khi xác thực hoặc lấy access token:', error);
    }
  };

  // Hàm gọi API test
  const fetchData = async () => {
    try {
      const response = await testAPI();
      setData(response);
    } catch (error) {
      console.error('Lỗi khi gọi API test:', error);
    }
  };

    // Hàm gọi API đăng nhập
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
        } else {
          console.error('Đăng nhập không thành công');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API đăng nhập:', error);
      }
    };

  useEffect(() => {
    handleAuthorization();
    fetchData();
  }, []);

  useEffect(() => {
    if (accessToken) {
      handleLogin(); 
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
        {/* Hiển thị các phần khác của Profile */}
        <div className="flex items-center justify-center">
          <div className="w-80 mt-10 rounded-lg border flex items-center justify-center flex-col">
            <span className="text-xl font-bold text-blue-500 mt-3 ">Hạng:</span>
            <span className="mt-3 mb-3">{user.membershipTier}</span>

            <button className="w-14 h-6 rounded-xl bg-red-500 mb-5 ">
              <span className="text-white">Ưu đãi</span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center mt-5">
          <button className="w-80 h-10 rounded-full flex items-center justify-center bg-red-500">
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
            <span className="ml-2 text-base ">Đánh giá sản phẩm</span>
          </button>
        </div>
        <div className="flex items-center justify-center mt-5">
          <div className="w-80 rounded-lg border flex items-center justify-around">
            <div className="flex flex-col items-start mr-20">
              <span className="text-xl font-bold mb-1">Điểm</span>
              <span className="text-orange-500">{user.points}</span>
              <Icon icon="zi-star" className="text-orange-500" />
            </div>
            <button className="w-20 h-10 rounded-xl bg-green-500 ">
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
            <button className="w-20 h-10 rounded-xl bg-orange-400 ">
              <span className="text-white">Chi tiết</span>
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ProfilePage;
