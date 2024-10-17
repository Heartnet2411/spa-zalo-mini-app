// Định nghĩa hàm để gọi API
export const fetchSliderConfigs = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/configs/slider`, // Sử dụng URL từ môi trường
      {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true', // Bỏ qua cảnh báo ngrok nếu cần
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data; // Trả về dữ liệu nhận được từ API
  } catch (error) {
    console.error('Error fetching slider configurations:', error);
    return null; // Trả về null nếu có lỗi
  }
};
