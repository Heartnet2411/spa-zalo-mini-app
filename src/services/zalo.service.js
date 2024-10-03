// zalo.service.js
import { getAccessToken } from 'zmp-sdk/apis';
import { authorize } from 'zmp-sdk/apis';
import { getUserInfo } from "zmp-sdk/apis";

// Lấy thông tin người dùng, sau khi Zalo cấp quyền
export const getZaloInfo = async () => {
  try {
    const data = await authorize({
      scopes: ['scope.userInfo'],
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Hàm lấy access token của Zalo
export const getZaloAccessToken = async () => {
  try {
    const accessToken = await getAccessToken({});
    return accessToken;
  } catch (error) {
    console.log(error);
  }
};

