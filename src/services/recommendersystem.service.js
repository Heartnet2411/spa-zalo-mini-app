// Hàm lấy các sản phẩm gợi ý cho người dùng
export const suggestProductsForUser = async (userId) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/suggest-products-for-user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching suggested products:', error);
    throw error; // Có thể ném lỗi lên để xử lý ở nơi khác
  }
};

// Hàm đánh giá sản phẩm
export const ratingProduct = async (productId, ratingData) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/rating-product/${productId}`, ratingData);
    return response.data;
  } catch (error) {
    console.error('Error rating product:', error);
    throw error;
  }
};

// Hàm tìm kiếm sản phẩm và cập nhật gợi ý
export const findProductToUpdateSuggestScore = async (productName) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/find-product-to-update-suggest-score-of-user/${productName}`);
    return response.data;
  } catch (error) {
    console.error('Error finding product to update suggest score:', error);
    throw error;
  }
};

// Hàm cập nhật danh sách gợi ý cho nhiều sản phẩm
export const updateSuggestedScoresForMultipleProducts = async (userId, products) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/update-suggest-products-for-multiple-products/${userId}`, { products });
    return response.data;
  } catch (error) {
    console.error('Error updating suggested scores for multiple products:', error);
    throw error;
  }
};

// Hàm cấu hình danh sách sản phẩm gợi ý khi mua 1 sản phẩm
export const configureProductRecommendations = async (userId, purchasedProductId) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/configure-product-recommendations/${userId}`, { purchasedProductId });
    return response.data;
  } catch (error) {
    console.error('Error configuring product recommendations:', error);
    throw error;
  }
};
