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
import Taskbar from '../components/taskbar';

const ProfilePage = () => {
  return (
    <div>
      <Page className="page">
        <Suspense>
          <div className="section-container">
            <span>Trang cá nhân</span>
          </div>
        </Suspense>
      </Page>
      <Taskbar />
    </div>
  );
};

export default ProfilePage;
