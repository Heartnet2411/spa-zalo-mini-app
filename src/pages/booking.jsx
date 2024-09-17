import React, { Suspense } from 'react';
import { Sheet, Button, Page, Text, useNavigate } from 'zmp-ui';
import Taskbar from '../components/taskbar';

const BookingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Page className="page">
        <Suspense>
          <div className="section-container">
            <span>Đặt lịch</span>
          </div>
        </Suspense>
      </Page>
      <Taskbar />
    </div>
  );
};

export default BookingPage;
