import { getZaloPhoneNumber } from './zalo.service';

export const registerAPI = async (zaloAccessToken, phoneToken = null) => {
  try {
    if (!phoneToken) {
      phoneToken = await getZaloPhoneNumber();
    } else {
      phoneToken = null;
    }
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zaloAccessToken,
          phoneToken,
          role: 'user',
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.table(data.userProfile);
      console.log('AcessToken::::');
      console.log(data.accessToken);
      console.log('RefreshToken::::');
      console.log(data.refreshToken);
      return data;
    } else {
      const errorData = await response.json();
      console.log(errorData.status);

      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.message}`
      );
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// ĐĂNG KÝ VỚI MÃ NGƯỜI GIỚI THIỆU

export const registerWithReferralAPI = async (
  zaloAccessToken,
  phoneToken = null,
  refferalCode
) => {
  try {
    if (!phoneToken) {
      phoneToken = await getZaloPhoneNumber();
    } else {
      phoneToken = null;
    }
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/auth/register/${refferalCode}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zaloAccessToken,
          phoneToken,
          role: 'user',
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.table(data.userProfile);
      console.log('AcessToken::::');
      console.log(data.accessToken);
      console.log('RefreshToken::::');
      console.log(data.refreshToken);
      return data;
    } else {
      const errorData = await response.json();
      console.log(errorData.error);

      throw new Error(response);
    }
  } catch (error) {
    console.error(error);
    return null;
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

    if (!response.ok) {
      // Kiểm tra mã lỗi
      console.log(response);
      if (response.status === 404) {
        console.log('Người dùng không tồn tại, hỏi mã tiếp thị liên kết...');
        let registerResult = null;
        // Nếu người dùng không tồn tại, yêu cầu nhập mã tiếp thị liên kết
        while (!registerResult) {
          const referralCode = prompt('Vui lòng nhập mã tiếp thị liên kết:');
          console.log(referralCode);

          if (referralCode) {
            // Nếu có mã tiếp thị liên kết, gọi API đăng ký với mã referral
            registerResult = await registerWithReferralAPI(
              zaloAccessToken,
              null,
              referralCode
            );
          } else {
            // Nếu không có mã referral, gọi API đăng ký thông thường
            registerResult = await registerAPI(zaloAccessToken);
          }
          // Kiểm tra kết quả từ API, nếu trả về null, tiếp tục yêu cầu nhập lại mã referral
          if (!registerResult) {
            console.log('Mã tiếp thị liên kết không hợp lệ. Vui lòng nhập lại.');
          }
        }
        return registerResult;
      } else {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.error?.message || 'Unknown error'}`
        );
      }
    }

    const data = await response.json();
    console.table(data.userProfile);
    console.table({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
