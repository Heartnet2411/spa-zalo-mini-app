// Hàm lấy các sản phẩm gợi ý cho người dùng
export const suggestProductsForUser = async (userId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/suggest-products-for-user/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching suggested products:', error);
    throw error; // Có thể ném lỗi lên để xử lý ở nơi khác
  }
};

// Hàm đánh giá sản phẩm
export const ratingProduct = async (productId, ratingData) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_URL}/rating-product/${productId}`,
      ratingData
    );
    return response.data;
  } catch (error) {
    console.error('Error rating product:', error);
    throw error;
  }
};

// Hàm cập nhật danh sách gợi ý cho nhiều sản phẩm
export const updateSuggestedScoresForMultipleProducts = async (
  userId,
  products
) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_URL}/update-suggest-products-for-multiple-products/${userId}`,
      { products }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error updating suggested scores for multiple products:',
      error
    );
    throw error;
  }
};

// Hàm cấu hình danh sách sản phẩm gợi ý khi mua 1 sản phẩm
export const configureProductRecommendations = async (
  userId,
  purchasedProductId
) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_URL}/configure-product-recommendations/${userId}`,
      { purchasedProductId }
    );
    return response.data;
  } catch (error) {
    console.error('Error configuring product recommendations:', error);
    throw error;
  }
};

export async function findProductToUpdateSuggestScore(productName, userId, page = 1, limit = 10) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/recommendations/find-product-to-update-suggest-score-of-user/${productName}?page=${page}&limit=${limit}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ id: userId }), // Truyền user ID trong body
      }
    );

    if (response.status === 404) {
      console.error('Product not found');
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('Error updating suggestion score:', error);
    return null;
  }
}

export const getCombinedProductRecommendations = async (
  mainItemId,
  customerId
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/recommendations/get-combined-product-recommendations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainItemId,
          id: customerId,
        }),
      }
    );

    // Kiểm tra và log thông tin phản hồi nếu không thành công
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Error details:', errorDetails);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Lấy gợi ý sản phẩm thành công:', result);
    return result;
  } catch (error) {
    console.error('Error fetching combined product recommendations:', error);
    return null;
  }
};

export const getCombinedServiceRecommendations = async (
  mainItemId,
  customerId
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/recommendations/get-combined-service-recommendations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: customerId,
          mainItemId: mainItemId,
        }),
      }
    );

    // Kiểm tra và log thông tin phản hồi nếu không thành công
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('Error details:', errorDetails);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Lấy gợi ý dịch vụ thành công:', result);
    return result;
  } catch (error) {
    console.error('Error fetching combined service recommendations:', error);
    return null;
  }
};

export const getSuggestedProductsForUser = async (userId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/recommendations/get-product-configuration`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'ngrok-skip-browser-warning': 'true', 
        },
        body: JSON.stringify({userId})
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // Ném lỗi nếu phản hồi không thành công
    }

    const suggestions = await response.json(); // Lấy dữ liệu khuyến nghị sản phẩm

    return suggestions; // Trả về dữ liệu khuyến nghị
  } catch (error) {
    console.error('Error fetching product suggestions:', error);
    return null; // Trả về null nếu có lỗi
  }
}

export const getSuggestedServicesForUser = async (userId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/recommendations/get-service-configuration`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'ngrok-skip-browser-warning': 'true', 
        },
        body: JSON.stringify({userId})
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // Ném lỗi nếu phản hồi không thành công
    }

    const suggestions = await response.json(); // Lấy dữ liệu khuyến nghị sản phẩm

    return suggestions; // Trả về dữ liệu khuyến nghị
  } catch (error) {
    console.error('Error fetching product suggestions:', error);
    return null; // Trả về null nếu có lỗi
  }
}