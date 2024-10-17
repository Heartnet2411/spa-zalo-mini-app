//KIỂM TRA XEM TÀI KHOẢN CÓ KẾT NỐI VỚI SERVER CHƯA
export const createMac = async (order, accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/payments/createMac`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(order),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const createOrder = async (order, accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/payments/createOrder`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(order),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const updateOrderWithZaloOrderId = async (id, payment, accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/payments/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(payment),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // LỖI: `data` được khai báo lại

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
