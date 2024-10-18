export const getCurrentUserRank = async (accessToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/ranks/current`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      `Error fetching user rank: ${error.response ? error.response.data.message : error.message}`
    );
  }
};
