export const getAllProduct = async (pagenumber, subCategoryId) => {
  try {
    var response;
    if (subCategoryId) {
      response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/products?page=${pagenumber}&limit=10&subCategoryId=${subCategoryId}`,
        {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
    } else {
      response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/products?page=${pagenumber}&limit=10`,
        {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
    }
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

export const getFiveProducts = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/products?&limit=5`,
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

export const fetchProductRecommendations = async (mainItemId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/recommendations/get-product-recommendations/${mainItemId}`, // URL với mainItemId
      {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true', // Thêm tiêu đề nếu cần
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // Ném lỗi nếu phản hồi không thành công
    }

    const recommendations = await response.json(); // Lấy dữ liệu khuyến nghị sản phẩm

    return recommendations; // Trả về dữ liệu khuyến nghị
  } catch (error) {
    console.error('Error fetching product recommendations:', error);
    return null; // Trả về null nếu có lỗi
  }
};
