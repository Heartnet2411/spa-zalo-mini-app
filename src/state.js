import { atom } from "recoil";
import { authorize, getUserInfo, getPhoneNumber } from "zmp-sdk/apis";

export const userState = atom({
  key: "userState",
  default: {
    userInfo: {},
    phoneNumber: '',
  },
});


export const fetchUserData = () => {
  return new Promise((resolve, reject) => {
    authorize({
      scopes: ["scope.userInfo", "scope.userPhonenumber"],
      success: (authData) => {
        getUserInfo({
          success: (userData) => {
            const { userInfo } = userData;
            getPhoneNumber({
              success: (phoneData) => {
                const { token } = phoneData;
                resolve({ userInfo, phoneNumber: token });
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
      },
      fail: (error) => {
        reject("Authorization Error: " + error);
      }
    });
  });
};
