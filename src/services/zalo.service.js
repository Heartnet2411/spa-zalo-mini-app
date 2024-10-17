import {
  getAccessToken,
  getPhoneNumber,
  authorize,
  setStorage,
  getStorage,
} from 'zmp-sdk/apis';

// Hàm yêu cầu quyền truy cập
const requestAuthorization = async (scopes) => {
  try {
    const scope = await authorize({ scopes });
    return scope;
  } catch (error) {
    console.error('Lỗi khi yêu cầu quyền truy cập:', error);
    return null;
  }
};

// Hàm lưu dữ liệu vào storage
export const setDataToStorage = async (data) => {
  try {
    const { errorKeys } = await setStorage({
      data: data,
    });
    if (errorKeys && errorKeys.length > 0) {
      console.error('Có lỗi khi lưu dữ liệu:', errorKeys);
    } else {
      console.log(data);
      console.log('Dữ liệu đã được lưu vào storage thành công.');
    }
  } catch (error) {
    console.error('Lỗi khi gọi API setStorage:', error);
  }
};

// Hàm lấy dữ liệu từ storage
export const getDataFromStorage = async () => {
  try {
    console.log('Đang lấy dữ liệu từ storage');

    // Lấy dữ liệu từ storage với các key cần thiết
    const { userInfoConfig, userPhoneConfig } = await getStorage({
      keys: ['userInfoConfig', 'userPhoneConfig'],
    });

    return { userInfoConfig, userPhoneConfig };
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu từ storage:', error);
    return null;
  }
};

// Hàm lấy access token của Zalo
export const getZaloAccessToken = async () => {
  try {
    const userData = await getDataFromStorage();

    // Nếu đã có quyền truy cập thông tin người dùng, trả về access token mới
    if (userData && userData.userInfoConfig === true) {
      const accessToken = await getAccessToken({});
      console.log('Zalo Access Token ::::', accessToken);
      return accessToken;
    }

    // Nếu chưa có, yêu cầu quyền truy cập thông tin người dùng
    const scope = await requestAuthorization(['scope.userInfo']);
    if (scope && scope['scope.userInfo']) {
      // Cập nhật trạng thái userInfoConfig vào storage
      await setDataToStorage({
        ...userData,
        userInfoConfig: true, // Cập nhật trạng thái userInfoConfig thành true
      });

      const accessToken = await getAccessToken({});
      console.log('Zalo Access Token ::::', accessToken);
      return accessToken;
    } else {
      console.log('Quyền truy cập thông tin người dùng chưa được cấp.');
      await setDataToStorage({ ...userData, userInfoConfig: false }); // Cập nhật trạng thái nếu không cấp quyền
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi lấy access token:', error);
    return null;
  }
};

// Hàm lấy số điện thoại của người dùng
export const getZaloPhoneNumber = async () => {
  try {
    const userData = await getDataFromStorage();

    // Nếu đã có quyền truy cập số điện thoại trước đó, trả về null (không hỏi lại)
    if (userData && userData.userPhoneConfig === true) {
      const data = await getPhoneNumber({});
      const { token: phoneToken } = data;
      return phoneToken;
    }

    // Nếu chưa có, yêu cầu quyền truy cập số điện thoại
    const scope = await requestAuthorization(['scope.userPhonenumber']);
    if (scope && scope['scope.userPhonenumber']) {
      const data = await getPhoneNumber({});
      const { token: phoneToken } = data;

      // Lưu trạng thái userPhoneConfig vào storage (không lưu phoneToken)
      await setDataToStorage({
        ...userData,
        userPhoneConfig: true, // Đánh dấu đã cấp quyền
      });

      return phoneToken; // Trả về phoneToken nếu đã cấp quyền
    } else {
      console.error('Quyền truy cập số điện thoại chưa được cấp.');
      await setDataToStorage({ ...userData, userPhoneConfig: false }); // Cập nhật trạng thái nếu không cấp quyền
      return null; // Trả về null nếu người dùng không cấp quyền
    }
  } catch (error) {
    console.error('Lỗi khi lấy số điện thoại:', error);
    return null;
  }
};
