export const createBookingAPI = async (bookingData, accessToken) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/bookings`, {
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


export const getBookingHistoriesByUserId = async (status, accessToken) => {
  try {
    let url = `${import.meta.env.VITE_SERVER_URL}/api/bookings/user`;
    if (status) {
      url += `?status=${encodeURIComponent(status)}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(errorData.message || 'Error fetching booking histories');
    }

    const bookingHistories = await response.json();
    return bookingHistories;
  } catch (error) {
    console.error('Error in getBookingHistoriesByUserId:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId, accessToken) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}` 
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to cancel the booking');
    }

    const data = await response.json();
    return data; 

  } catch (error) {
    console.error('Error cancelling booking:', error.message);
    throw error; 
  }
};

