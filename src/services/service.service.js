export const getAllCategory = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/categories`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Trả về dữ liệu đã lấy
  } catch (error) {
    console.error('Error fetching services:', error);
    return null; // Hoặc có thể trả về một mảng rỗng nếu muốn
  }
};

export const getAllServices = async (pageNumber, keyword = '') => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/services?page=${pageNumber}&limit=10&keyword=${keyword}`,
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
    console.error('Error fetching services data:', error);
    return null;
  }
};

export const getFiveServices = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/services?limit=5`,
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
    console.error('Error fetching services:', error);
    return null;
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/services/${id}`, // Thay đổi URL để bao gồm ID sản phẩm
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

    const service = await response.json(); // Lấy dữ liệu sản phẩm

    return service; // Trả về sản phẩm
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null; // Trả về null nếu có lỗi
  }
};

export const fetchServiceRecommendations = async (mainItemId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/recommendations/get-service-recommendations/${mainItemId}`, // URL với mainItemId
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
