import React, { Suspense } from 'react';
import {
  Avatar,
  List,
  Text,
  Box,
  Page,
  Button,
  Icon,
  useNavigate,
} from 'zmp-ui';
import Header from '../components/header';

const ProfilePage = () => {
  return (
    <div>
      <Page className="page relative">
        <Header />
        <Suspense>
          <div className="section-container mt-14">
            <span>Trang cá nhân</span>
          </div>
        </Suspense>
      </Page>
    </div>
  );
};

export default ProfilePage;
