export const getReferralInfo = async (referralCode, accessToken) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users/referral-info/${referralCode}`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Authorization': `Bearer ${accessToken}`, 
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Failed to fetch referral info:", error);
    throw error; 
  }
};
