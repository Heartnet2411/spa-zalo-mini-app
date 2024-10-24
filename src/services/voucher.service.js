export const exchangeVoucher = async (voucherId, accessToken) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/vouchers/exchange/${voucherId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to exchange voucher');
        }

        return data;
    } catch (error) {
        console.error('Error exchanging voucher:', error);
        throw error;
    }
};


export const getUserVouchers = async (accessToken) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/vouchers/user/vouchers`, {
            method: 'GET',
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const vouchers = await response.json();
        return vouchers;
    } catch (error) {
        console.error("Error fetching user vouchers:", error);
        throw error;
    }
};

// export const getVouchers = async ( accessToken ) => {
//     try {
//         const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/vouchers`, {
//             method: 'GET',
//             headers: {
//                 'ngrok-skip-browser-warning': 'true',
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (!response.ok) {
//             throw new Error(`Error: ${response.status}`);
//         }

//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error("Error fetching vouchers:", error);
//         throw error;
//     }
// };


export const getVouchersUserCanExchange = async (accessToken) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/vouchers/user/can-exchange`, {
            method: 'GET',
            headers: {
                'ngrok-skip-browser-warning': 'true',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch vouchers');
        }

        return data; // Trả về dữ liệu bao gồm voucher, currentPage, totalPages, và totalVouchers
    } catch (error) {
        console.error('Error fetching vouchers:', error);
        throw error; // Ném lại lỗi để có thể xử lý ở component
    }
};
