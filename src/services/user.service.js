import { getZaloAccessToken } from './zalo.service';

//UPDATE THÔNG TIN NGƯỜI DÙNG THEO ZALOID
export const updateUserInfoAPI = async (zaloId, userInfo, accessToken) => {
  try {
    const { name, gender, phone } = userInfo; // Thêm phone để đảm bảo dữ liệu hợp lệ
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/users/update-user-info/${zaloId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, phone, gender }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating user info:', error);
  }
};

//UPDATE SĐT DÙNG THEO ZALOID
export const updateUserPhoneAPI = async (zaloId) => {
  try {
    let phoneToken;
    if (!phoneToken) {
      phoneToken = await getZaloPhoneNumber();
    } else {
      phoneToken = null;
    }
    const zaloAccessToken = await getZaloAccessToken();
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/users/update-user-phone/${zaloId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          //'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'phone-token': phoneToken,
          'zalo-access-token': zaloAccessToken,
        },
      }
    );

    // Không gì thay đổi
    if (response.status === 204) {
      console.log("No changes made to the user's phone number.");
      return null; // Hoặc trả về một thông báo thích hợp
    }

    // Lỗi
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Cập nhật thành công
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getAllAddress = async (accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/users/address/all`,
      {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',

          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export const addNewAddress = async (address, accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/users/address`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(address)
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};
