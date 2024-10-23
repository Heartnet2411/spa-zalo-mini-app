import React, { useState } from 'react';
import { Page, Text, useNavigate } from 'zmp-ui';
import Header from '../components/header';
import { Payment } from 'zmp-sdk';
import { EventName, events } from 'zmp-sdk/apis';
import { useRecoilState, useRecoilValue } from 'recoil';
import { paymentResultState, userState } from '../state';

const PaymentResult = () => {
    const { orderId, status } = useRecoilValue(paymentResultState);

    return (
        <Page className="page flex flex-col items-center justify-center h-screen">
            <Header />
            <Text className="text-lg text-center">
                {status === 'success' ? 'Giao dịch thành công!' : 'Giao dịch thất bại!'}
            </Text>
            {orderId && <Text className="text-md text-center">Mã đơn hàng: {orderId}</Text>}
        </Page>
    );
};

export default PaymentResult;
