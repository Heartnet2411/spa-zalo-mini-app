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
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/services?page=${pageNumber}&limit=10&keyword=${keyword}`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

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
