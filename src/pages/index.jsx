import React, { Suspense, useEffect } from 'react';
import { List, Page, Icon, useNavigate } from 'zmp-ui';
import zm from 'zmp-sdk';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Page className="page">
        <Suspense>
          <div className="section-container">
            <span> Trang chủ</span>
          </div>
        </Suspense>
      </Page>
    </div>
  );
};

export default HomePage;
