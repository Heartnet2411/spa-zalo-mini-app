import React, { useState } from 'react';
import { Page, Text, useNavigate } from 'zmp-ui';
import Header from '../components/header';
import OrderTags from '../components/order-tag'; // Ensure this is your OrderTags component

const OrderStatusPage = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('Tất cả');

  return (
    <Page className="page">
      <Header />

      {/* Filter Tags */}
      <div className="mt-14 mb-2">
        <OrderTags
          selectedCategory={filterStatus}
          onSelectCategory={setFilterStatus}
        />
      </div>

      <Text className="text-center">Hiện tại chưa có đơn hàng</Text>
    </Page>
  );
};

export default OrderStatusPage;
