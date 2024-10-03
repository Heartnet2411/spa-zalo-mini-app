//KIỂM TRA XEM TÀI KHOẢN CÓ KẾT NỐI VỚI SERVER CHƯA
export const testAPI = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};