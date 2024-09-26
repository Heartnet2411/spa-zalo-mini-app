import { atom } from 'recoil';
import { authorize, getUserInfo, getPhoneNumber } from 'zmp-sdk/apis';

export const userState = atom({
  key: 'userState',
  default: {
    userInfo: {},
    phoneNumber: '',
  },
});

// Hàm gọi API Backend để lấy thông tin người dùng
const fetchBackendUserInfo = async (zaloId, token) => {
  try {
    const response = await fetch(`http://localhost:8080/api/users/user-info/${zaloId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user info from backend");
    }

    const userInfo = await response.json();
    return userInfo;
  } catch (error) {
    console.error("Error fetching user info from backend:", error);
    throw error;
  }
};

// Hàm gọi API từ Zalo SDK và Backend, cập nhật userState
export const fetchUserData = () => {
  return new Promise((resolve, reject) => {
    authorize({
      scopes: ["scope.userInfo", "scope.userPhonenumber"],
      success: async (authData) => {
        try {
          // Lấy thông tin từ Zalo SDK
          getUserInfo({
            success: async (userData) => {
              const { userInfo } = userData;

              getPhoneNumber({
                success: async (phoneData) => {
                  const { token } = phoneData;

                  // Gọi API từ Backend để cập nhật thông tin
                  try {
                    const backendUserInfo = await fetchBackendUserInfo(userInfo.zaloId, token);

                    // Cập nhật trạng thái người dùng
                    resolve({
                      userInfo: backendUserInfo,
                      phoneNumber: phoneData.phoneNumber,
                    });
                  } catch (error) {
                    reject("Backend Fetch Error: " + error.message);
                  }
                },
                fail: (error) => {
                  reject("Get Phone Number Error: " + error);
                }
              });
            },
            fail: (error) => {
              reject("Get User Info Error: " + error);
            }
          });
        } catch (error) {
          reject("Authorization Error: " + error);
        }
      },
      fail: (error) => {
        reject("Authorization Error: " + error);
      }
    });
  });
};


// export const fetchUserData = async () => {
//   return new Promise((resolve, reject) => {
//     authorize({
//       scopes: ["scope.userInfo", "scope.userPhonenumber"],
//       success: async (authData) => {
//         try {
//           const userData = await new Promise((res, rej) => {
//             getUserInfo({
//               success: (data) => res(data),
//               fail: (error) => rej("Get User Info Error: " + error),
//             });
//           });

//           const { userInfo } = userData;

//           const phoneData = await new Promise((res, rej) => {
//             getPhoneNumber({
//               success: (data) => res(data),
//               fail: (error) => rej("Get Phone Number Error: " + error),
//             });
//           });

//           const { token: phoneNumber } = phoneData;

//           resolve({ userInfo, phoneNumber });
//         } catch (error) {
//           reject(error);
//         }
//       },
//       fail: (error) => {
//         reject("Authorization Error: " + error);
//       }
//     });
//   });
// };
