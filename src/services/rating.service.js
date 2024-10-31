export const rateProduct = async ({ userId, productID, orderID, variantID, volume, rating, comment, images, accessToken }) => {
  const formData = new FormData();
  formData.append("productID", productID);
  formData.append("orderID", orderID);
  formData.append("variantID", variantID);
  formData.append("volume", volume);
  formData.append("rating", rating);
  formData.append("comment", comment);

  if (images) {
    images.forEach((image) => formData.append("images", image));
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
      const errorData = await response.json();
      throw new Error(`Failed to rate product: ${errorData.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in rateProduct service:", error.message);
    throw error;
  }
};

export const getProductReviews = async (productId, page) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/recommendations/get-reviews-by-product-id/${productId}?page=${page}&limit=10`, {
      method: "GET",
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to rate product: ${errorData.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in rateProduct service:", error.message);
    throw error;
  }
};
