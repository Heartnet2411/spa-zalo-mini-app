
export const rateProduct = async ({ userId, productID, orderID, rating, comment, images, accessToken }) => {

  // Tạo FormData để gửi ảnh và dữ liệu đánh giá
  const formData = new FormData();
  formData.append("productID", productID);
  formData.append("orderID", orderID);
  formData.append("rating", rating);
  formData.append("comment", comment);

  // Thêm từng file ảnh vào FormData
  if (images) {
    images.forEach((image, index) => formData.append("images", image));
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/recommendations/rating-product/${userId}`, {
      method: "PUT",
      headers: {
        'ngrok-skip-browser-warning': 'true',
        Authorization: `Bearer ${accessToken}`, 
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to rate product");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in rateProduct service:", error.message);
    throw error;
  }
};
