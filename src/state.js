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

// //FETCH DỮ LIỆU TỪ BÊN ZALO NÊN GỌI DUY NHẤT 1 LẦN
// export const fetchUserData = () => {
//   return new Promise((resolve, reject) => {
//     authorize({
//       scopes: ['scope.userInfo', 'scope.userPhonenumber'],
//       success: (authData) => {
//         getUserInfo({
//           success: (userData) => {
//             const { userInfo } = userData;
//             console.log('User Info:', userInfo);
//             getPhoneNumber({
//               success: (phoneData) => {
//                 const { token } = phoneData;
//                 resolve({ userInfo, phoneNumber: token });
//                 // THÊM TẠM ĐĂNG KÝ Ở ĐÂY
//                 registerAPI(userInfo);
//               },
//               fail: (error) => {
//                 reject('Get Phone Number Error: ' + error);
//               },
//             });
//           },
//           fail: (error) => {
//             reject('Get User Info Error: ' + error);
//           },
//         });
//       },
//       fail: (error) => {
//         reject('Authorization Error: ' + error);
//       },
//     });
//   });
// };

// //KIỂM TRA XEM TÀI KHOẢN CÓ KẾT NỐI VỚI SERVER CHƯA
// export const testFetchAPI = async () => {
//   try {
//     const response = await fetch('http://localhost:8080');
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.text();
//     console.log(data);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };

// // ĐĂNG KÝ TÀI KHOẢN MINI APP CHO LẦN ĐẦU DÙNG APP
// export const registerAPI = async (userData) => {
//   try {
//     const { id, name, avatar } = userData;
//     const response = await fetch('http://localhost:8080/auth/register', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         zaloId: id,
//         name,
//         urlImage: avatar,
//         role: 'user',
//       }),
//     });
//     if (!response.ok) {
//       console.log('Đăng ký bằng Zalo ID thành công');
//     }
//     if (!response.ok) {
//       //Nếu tài khoản đã tồn tại thì đăng nhập
//       if (response.status === 409) {
//         console.log('Đăng nhập bằng Zalo ID');
//         loginAPI(userData);
//       } else {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//     }
//     const data = await response.json();
//     console.table({
//       accessToken: data.accessToken,
//       refreshToken: data.refreshToken,
//     });
//     Cookies.set('accessToken', data.accessToken, { expires: 1 / 24 });
//     Cookies.set('refreshToken', data.refreshToken, { expires: 7 });
//     return data;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };

// // ĐĂNG NHẬP TÀI KHOẢN MINI APP
// export const loginAPI = async (userData) => {
//   try {
//     const { id } = userData;
//     const response = await fetch('http://localhost:8080/auth/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         zaloId: id,
//         role: 'user',
//       }),
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     console.table({
//       accessToken: data.accessToken,
//       refreshToken: data.refreshToken,
//     });
//     Cookies.set('accessToken', data.accessToken, { expires: 1 / 24 });
//     Cookies.set('refreshToken', data.refreshToken, { expires: 7 });
//     return data;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };

// // LẤY THÔNG TIN NGƯỜI DÙNG
// export const getUserInfoAPI = async (zaloId) => {
//   try {
//     const response = await fetch(
//       `http://localhost:8080/auth/users/user-info/${zaloId}`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + Cookies.get('accessToken'),
//         },
//         body: JSON.stringify({}),
//       }
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     console.log(data);
//     return data;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };

// // LẤY THÔNG TIN NGƯỜI DÙNG
// export const updateUserInfoAPI = async (zaloId, name, phone) => {
//   try {
//     const response = await fetch(
//       `http://localhost:8080/auth/users/update-user-info/${zaloId}`,
//       {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + Cookies.get('accessToken'),
//         },
//         body: JSON.stringify({
//           name,
//           phone
//         }),
//       }
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     console.log(data);
//     return data;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };
