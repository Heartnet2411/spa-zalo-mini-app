export const createBookingAPI = async (bookingData, accessToken) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Booking created successfully:', data);
    return data;

  } catch (error) {
    console.error('Error creating booking:', error);
  }
};


export const getBookingHistoriesByUserId = async (userId, status, accessToken) => {
  try {
      let url = `${import.meta.env.VITE_SERVER_URL}/api/booking-histories`;
      if (status) {
          url += `?status=${encodeURIComponent(status)}`;
      }

      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
          }
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error fetching booking histories');
      }

      const bookingHistories = await response.json();
      return bookingHistories;
  } catch (error) {
      console.error('Error in getBookingHistoriesByUserId:', error);
      throw error; 
  }
};