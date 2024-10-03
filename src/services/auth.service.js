export const registerAPI = async (zaloAccessToken) => {
  try {
    // alert('Đang đăng ký bằng Zalo ID');
    // alert(`${import.meta.env.VITE_SERVER_URL}/auth/register`);
    
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zaloAccessToken,
          role: 'user',
        }),
      }
    );

    if (response.ok) {
      // alert('Đăng ký bằng Zalo ID thành công');
      const data = await response.json();
      console.table(data.userProfile);
      console.table({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      return data;
    } else {
      // alert('Đăng ký bằng Zalo ID thất bại');
      // alert(`HTTP error! status: ${response.status}`);

      // Lấy dữ liệu lỗi dưới dạng JSON
      const errorData = await response.text();
      // alert(`Error code: ${errorData}`);

      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }
  } catch (error) {
    // alert('Đã xảy ra lỗi trong quá trình gọi API.');
    // alert(`Error: ${error.message}`);
    console.error('Error fetching data:', error);
  }
};


// ĐĂNG NHẬP TÀI KHOẢN MINI APP
export const loginAPI = async (zaloAccessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zaloAccessToken,
          role: 'user',
        }),
      }
    );
    // alert('Đang đăng nhap ');
    if (!response.ok) {
      // Kiểm tra mã lỗi
      if (response.status === 404) {
        console.log('Người dùng không tồn tại, tiến hành đăng ký...');
        // alert('Người dùng không tồn tại, tiến hành đăng ký...');

        // Gọi hàm đăng ký
        return await registerAPI(zaloAccessToken);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // alert('Đăng nhap thanh cong');
    console.table(data.userProfile);
    console.table({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    //lưu data.accessToken, data.refreshToken, data.userProfile
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// //UPDATE THÔNG TIN NGƯỜI DÙNG THEO ZALOID
// export const updateUserInfoAPI = async (zaloId, userInfo) => {
//   try {
//     const { name, phone, gender } = userInfo;
//     const response = await fetch(
//       `${import.meta.env.VITE_SERVER_URL}/api/users/update-user-info/${zaloId}`,
//       {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json', 
//           //'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 
//           // Lấy nơi lưu trữ access token để xác thực api hợp lệ
//         },
//         body: JSON.stringify({ name, phone, gender }), 
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };

export const updateUserInfoAPI = async (zaloId, userInfo, accessToken) => {
  try {
    const { name, phone, gender } = userInfo;
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/users/update-user-info/${zaloId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Sử dụng access token từ Recoil
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
    console.error('Error fetching data:', error);
  }
};
