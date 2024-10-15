export const getAllProduct = async (pagenumber) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/products?page=${pagenumber}&limit=10`,
      {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
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

export const getProductById = async (id) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/products/${id}`, // Thay đổi URL để bao gồm ID sản phẩm
      {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const product = await response.json(); // Lấy dữ liệu sản phẩm

    return product; // Trả về sản phẩm
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null; // Trả về null nếu có lỗi
  }
};
