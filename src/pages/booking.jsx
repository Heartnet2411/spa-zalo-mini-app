import React, { Suspense } from 'react';
import { Sheet, Button, Page, Text, useNavigate } from 'zmp-ui';
import Header from '../components/header';
import ServiceChoose from '../components/service-choose';

const BookingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Page className="page relative">
        <Header />
        <Suspense>
          <div className="section-container mt-14">
            <span>Đặt lịch</span>
            <ServiceChoose />
          </div>
        </Suspense>
      </Page>
    </div>
  );
};

export default BookingPage;
