import React, { useEffect } from 'react';
import {
  Avatar,
  List,
  Text,
  Box,
  Page,
  Button,
  Icon,
  useNavigate,
} from 'zmp-ui';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState, fetchUserData } from '../state';

const ProfilePage = () => {
  const setUserState = useSetRecoilState(userState);
  const { userInfo: user, phoneNumber } = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { userInfo, phoneNumber } = await fetchUserData();
        setUserState({ userInfo, phoneNumber });
      } catch (error) {
        console.error(error);
      }
    };

    getUserData();
  }, [setUserState]);

  return (
    <div>
      <Page className="page">
        <Box
          flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box mt={10}>
            <Avatar
              size={96}
              src={
                user.avatar && user.avatar.startsWith('http')
                  ? user.avatar
                  : undefined
              }
            >
              {user.avatar}
            </Avatar>
          </Box>
          <Box flex flexDirection="row" alignItems="center" ml={8}>
            <Box>
              <Text.Title>{user.name}</Text.Title>
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
        <div className="flex items-center justify-center">
          <div className="w-80 mt-10 rounded-lg border flex items-center justify-center flex-col">
            <span className="text-xl font-bold text-blue-500 mt-3 ">Hạng:</span>
            <span className="mt-3 mb-3">Khách hàng</span>

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
          <div className="w-80 rounded-lg border flex items-center justify-around">
            <div className="flex flex-col items-start mr-20">
              <span className="text-xl font-bold mb-1">Điểm</span>

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
      </Page>
    </div>
  );
};

export default ProfilePage;
