export const createBookingAPI = async (bookingData) => {
    try {
      // Gửi yêu cầu POST đến backend để tạo booking
      const response = await fetch('http://localhost:8080/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Lấy access token từ cookie và gửi trong header để xác thực
          Authorization: 'Bearer ' + Cookies.get('accessToken'),
        },
        // Dữ liệu booking được gửi dưới dạng JSON
        body: JSON.stringify(bookingData),
      });
  
      // Kiểm tra nếu request không thành công
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parse dữ liệu trả về từ server
      const data = await response.json();
      console.log('Booking created successfully:', data);
      return data;
  
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };