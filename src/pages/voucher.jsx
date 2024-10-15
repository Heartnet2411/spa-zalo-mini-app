import React, { useState } from 'react';
import { Page, Text } from 'zmp-ui';
import Header from '../components/header';
import VoucherTags from '../components/voucher-tag';

const VoucherPage = () => {
  const [filterStatus, setFilterStatus] = useState('Ưu đãi'); 

  const displayText = filterStatus === 'Ưu đãi'
    ? 'Hiện tại chưa có voucher'
    : 'Hiện tại chưa có lịch sử ưu đãi';

  return (
    <Page className="page">
      <Header />

      {/* Filter Tags */}
      <div className="mt-14 mb-2">
        <VoucherTags
          selectedCategory={filterStatus}
          onSelectCategory={setFilterStatus}
        />
      </div>

      <Text className="text-center">{displayText}</Text>
    </Page>
  );
};

export default VoucherPage;
