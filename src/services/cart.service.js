export const fetchUserCart = async (accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/carts`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`, // Thêm Access Token vào header để xác thực
          'ngrok-skip-browser-warning': 'true', // Tùy chọn header để bỏ qua cảnh báo ngrok
        },
      }
    );

    // Kiểm tra nếu phản hồi không thành công
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Chuyển đổi dữ liệu JSON
    const cartData = await response.json();
    return cartData;
  } catch (error) {
    console.error('Error fetching cart data:', error);
    return null;
  }
};

export const addToCart = async (productId, quantity, accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/carts/add/${productId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ quantity }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Trả về dữ liệu giỏ hàng sau khi thêm sản phẩm
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
};

export const removeItemFromCart = async (itemId, accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/carts/remove/${itemId}`, // Đường dẫn tới API
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // Gửi access token trong header
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Sản phẩm đã được xóa khỏi giỏ hàng:', result);
    return result; // Có thể trả về kết quả nếu cần
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return null; // Trả về null nếu có lỗi
  }
};