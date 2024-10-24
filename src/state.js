import { atom } from 'recoil';
import { authorize, getUserInfo, getPhoneNumber } from 'zmp-sdk/apis';
import Cookies from 'js-cookie';

export const userState = atom({
  key: 'userState',
  default: {
    userInfo: {},
    accessToken: '',
    refreshToken: '',
  },
});

export const paymentResultState = atom({
  key: 'paymentResultState',
  default: { orderId: '', status: 'pending' },
});
