import React from 'react';
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
import { useRecoilValue } from 'recoil';
import { displayNameState, userState } from '../state';

const users = {
  id: 1,
  name: 'Nguyen Van A',
  address: '123 Main St',
  gender: 'Nam',
  birth: '2000-01-01',
};

const ProfilePage = () => {
  const { userInfo: user } = useRecoilValue(userState);
  const displayName = useRecoilValue(displayNameState);
  const navigate = useNavigate();

  return (
    <div>
      <Page className="page">
        <Box
          flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            mt={10}
          >
            <Avatar
              story="default"
              size={96}
              online
              src={user.avatar.startsWith('http') ? user.avatar : undefined}
            >
              {user.avatar}
            </Avatar>
          </Box>
          <Box flex flexDirection="row" alignItems="center" ml={8}>
            <Box>
              <Text.Title>{displayName || user.name}</Text.Title>
            </Box>
            <Box ml={4}>
              <Button
                onClick={() => {
                  navigate('/form');
                }}
                size="small"
                icon={<Icon icon="zi-edit" />}
              />
            </Box>
          </Box>
        </Box>
        <Box m={0} p={0} mt={4}>
          <div className="section-container">
            <List>
              <List.Item title="Họ tên" subTitle={displayName} />
              <List.Item title="Địa chỉ" subTitle={users.address} />
              <List.Item title="Giới tính" subTitle={users.gender} />
              <List.Item title="Ngày sinh" subTitle={users.birth} />
              <List.Item title="ID" subTitle={user.id} />
            </List>
          </div>
        </Box>
      </Page>
    </div>
  );
};

export default ProfilePage;
