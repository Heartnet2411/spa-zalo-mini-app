import React, { useState } from 'react';
import { Box, Page, Avatar } from 'zmp-ui';
import { useNavigate } from 'react-router';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../state';
import Header from '../components/header';
import { updateUserInfoAPI } from '../services/user.service';

const FormPage = () => {
  const setUserState = useSetRecoilState(userState);
  const { userInfo: user, accessToken } = useRecoilValue(userState); // Lấy accessToken
  const navigate = useNavigate();

  // Tạo state để lưu trữ dữ liệu thay đổi từ form
  const [phone, setPhone] = useState(user.phone || '');
  const [gender, setGender] = useState(user.gender || '');

  const handleUpdateUserInfo = async () => {
    const updatedUserInfo = {
      name: user.name,
      phone,
      gender,
    };

    try {
      const response = await updateUserInfoAPI(
        user.zaloId,
        updatedUserInfo,
        accessToken
      );
      if (response) {
        setUserState((prevState) => ({
          ...prevState,
          userInfo: {
            ...prevState.userInfo,
            phone: updatedUserInfo.phone,
            gender: updatedUserInfo.gender,
          },
        }));
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  return (
    <Page className="page">
      <Header />
      <div className="section-container p-4 mt-14 mb-14">
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
          <Box m={0} p={0} mt={10}>
            <div className="section-container">
              <div className="mb-4 flex items-center justify-center flex-row">
                <label className="block text-gray-700 text-sm font-bold mb-2 w-40">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border p-2 rounded-md"
                />
              </div>

              <div className="mb-4 flex items-center justify-center flex-row">
                <label className="block text-gray-700 text-sm font-bold mb-2 w-40">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={user.name}
                  className="w-full border p-2 rounded-md"
                  readOnly
                />
              </div>

              <div className="mb-4 flex items-center justify-center flex-row">
                <label className="block text-gray-700 text-sm font-bold mb-2 w-40">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full p-1.5 px-5 rounded-lg border"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>
            </div>
          </Box>

          <div className="flex items-center justify-center mt-5">
            <div className="text-center" onClick={() => navigate(-1)}>
              <button className="p-1 px-8 bg-gray-300 rounded-xl mr-16">
                <span className="text-lg">Quay lại</span>
              </button>
            </div>

            <button
              className="p-1 px-8 bg-pink-300 rounded-xl"
              onClick={handleUpdateUserInfo}
            >
              <span className="text-lg">Cập nhật</span>
            </button>
          </div>
        </Box>
      </div>
    </Page>
  );
};

export default FormPage;
