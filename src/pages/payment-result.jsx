import React, { useState } from 'react';
import { Button, Icon, Page, Text, useNavigate } from 'zmp-ui';
import Header from '../components/header';
import { Payment } from 'zmp-sdk';
import { EventName, events } from 'zmp-sdk/apis';
import { useRecoilState, useRecoilValue } from 'recoil';
import { paymentResultState, userState } from '../state';
import { Link } from 'react-router-dom';

const PaymentResult = () => {
  const { orderId, status } = useRecoilValue(paymentResultState);

  return (
    <Page className="page flex flex-col items-center justify-center h-screen">
      <Header />
      <Text className="text-lg text-center">
        <div className="flex flex-col justify-center items-center gap-6">
          {status === 'success' ? (
            <Icon
              icon="zi-check-circle"
              className="bg-green-500 rounded-full text-white"
              size={80}
            ></Icon>
          ) : (
            <Icon
              icon="zi-close-circle"
              className="bg-red-500 rounded-full text-white"
              size={80}
            />
          )}
          {status === 'success' ? (
            <span className="text-xl font-semibold">Giao dịch thành công!</span>
          ) : (
            <span className="text-xl font-semibold">Giao dịch thất bại!</span>
          )}
          <Link to="/">
            <Button>Trở về Trang chủ</Button>
          </Link>
        </div>
      </Text>
    </Page>
  );
};

export default PaymentResult;
